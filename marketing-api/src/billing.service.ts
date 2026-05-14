import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { CompanyProvisioningService, ProvisionCompanyPayload } from './company-provisioning.service';
import { MailService } from './mail.service';

export type CheckoutRequest = {
  plan: 'starter' | 'team' | 'business';
  companyName: string;
  vatNumber: string;
  contactName: string;
  email: string;
  phone?: string;
  employees?: string;
  address?: string;
  city?: string;
};

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe?: Stripe;

  constructor(
    private readonly mail: MailService,
    private readonly provisioning: CompanyProvisioningService,
  ) {
    if (process.env.STRIPE_SECRET_KEY) this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  private priceFor(plan: string) {
    const map: Record<string, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      team: process.env.STRIPE_PRICE_TEAM,
      business: process.env.STRIPE_PRICE_BUSINESS,
    };
    return map[plan];
  }

  private assertStripe() {
    if (!this.stripe) throw new BadRequestException('Pagamento online non ancora configurato. STRIPE_SECRET_KEY mancante.');
    return this.stripe;
  }

  async checkout(dto: CheckoutRequest) {
    const stripe = this.assertStripe();
    const price = this.priceFor(dto.plan);
    if (!price) throw new BadRequestException('Prezzo Stripe non configurato per il piano selezionato.');
    if (!price.startsWith('price_')) {
      throw new BadRequestException(`Configurazione Stripe non valida per il piano "${dto.plan}": devi usare un Price ID tipo price_xxx, non un prezzo numerico.`);
    }

    const base = process.env.PUBLIC_SITE_URL || 'https://teamcontrolcenter.it';
    const metadata = this.toMetadata(dto);

    this.logger.log(`[CHECKOUT][START] plan=${dto.plan} company=${dto.companyName} vat=${dto.vatNumber} email=${this.maskEmail(dto.email)} price=${price}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: dto.email,
      client_reference_id: dto.vatNumber || dto.email,
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/prezzi?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/prezzi?checkout=cancel&session_id={CHECKOUT_SESSION_ID}`,
      metadata,
      subscription_data: { metadata },
      allow_promotion_codes: true,
    });

    this.logger.log(`[CHECKOUT][OK] session=${session.id} url=${session.url ? 'created' : 'missing'}`);
    return { url: session.url, sessionId: session.id };
  }

  async notifyCheckoutResult(sessionId: string, result: 'success' | 'cancel') {
    const stripe = this.assertStripe();
    this.logger.log(`[CHECKOUT_RESULT][START] session=${sessionId} result=${result}`);

    // Questo endpoint è chiamato dal frontend solo per mostrare il banner.
    // Non deve fare provisioning azienda e non deve inviare mail, altrimenti il browser può ricevere 504.
    // Le operazioni post-pagamento vengono gestite dal webhook Stripe in modalità asincrona.
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const response = {
      status: result === 'success' && (session.status === 'complete' || session.payment_status === 'paid') ? 'success' : result,
      message:
        result === 'success'
          ? 'Pagamento ricevuto. Attivazione azienda e notifiche vengono gestite dal webhook Stripe.'
          : 'Pagamento non completato o annullato.',
      stripe: {
        sessionId: session.id,
        sessionStatus: session.status,
        paymentStatus: session.payment_status,
      },
    };

    this.logger.log(
      `[CHECKOUT_RESULT][FAST_OK] session=${session.id} result=${result} status=${session.status} payment_status=${session.payment_status}`,
    );
    return response;
  }

  async handleStripeEvent(event: Stripe.Event) {
    this.logger.log(`[STRIPE_WEBHOOK][EVENT] type=${event.type} id=${event.id}`);
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired':
        await this.handleCheckoutCancelled(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        this.logger.log(`[STRIPE_WEBHOOK][IGNORED] type=${event.type}`);
        break;
    }
  }

  private async handleCheckoutCompleted(inputSession: Stripe.Checkout.Session) {
    const stripe = this.assertStripe();
    const session = await stripe.checkout.sessions.retrieve(inputSession.id);
    const data = this.fromMetadata(session.metadata || {});
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    const email = session.customer_details?.email || data.email;

    this.logger.log(
      `[PAYMENT_SUCCESS][START] session=${session.id} status=${session.status} payment_status=${session.payment_status} company=${data.companyName} email=${this.maskEmail(email)}`,
    );

    let companyProvisioningResult: any = { skipped: true, reason: 'already provisioned' };
    if (session.metadata?.company_provisioned === 'true') {
      this.logger.log(`[PAYMENT_SUCCESS][PROVISIONING][SKIP] session=${session.id} company_provisioned=true`);
    } else {
      const provisioningPayload: ProvisionCompanyPayload = {
        ...data,
        stripeCustomerId,
        stripeSubscriptionId,
        stripeCheckoutSessionId: session.id,
      };
      companyProvisioningResult = await this.provisioning.createActiveCompany(provisioningPayload);
    }

    const payload = {
      ...data,
      stripeSessionId: session.id,
      stripeCustomerId,
      stripeSubscriptionId,
      paymentStatus: session.payment_status,
      companyProvisioningResult,
    };

    const mailResults: Array<unknown> = [];
    if (session.metadata?.payment_success_notified === 'true') {
      this.logger.log(`[PAYMENT_SUCCESS][MAIL][SKIP] session=${session.id} payment_success_notified=true`);
    } else {
      if (email) {
        mailResults.push(await this.mail.safeSend('pagamento riuscito cliente', () => this.mail.sendPaymentSuccessCustomer(email, payload)));
      } else {
        this.logger.warn(`[PAYMENT_SUCCESS][MAIL][CUSTOMER][SKIP] session=${session.id} email cliente assente`);
      }
      mailResults.push(await this.mail.safeSend('pagamento riuscito interno', () => this.mail.sendPaymentSuccessInternal(payload)));
    }

    const metadataUpdate: Stripe.MetadataParam = {
      ...(session.metadata || {}),
      payment_success_notified: mailResults.some((item: any) => item?.ok) || session.metadata?.payment_success_notified === 'true' ? 'true' : 'false',
      company_provisioned: companyProvisioningResult?.ok || session.metadata?.company_provisioned === 'true' ? 'true' : 'false',
      last_payment_success_handled_at: new Date().toISOString(),
    };

    if (!companyProvisioningResult?.ok) {
      metadataUpdate.company_provisioning_error = String(companyProvisioningResult?.error || companyProvisioningResult?.reason || 'unknown').slice(0, 450);
    } else {
      metadataUpdate.company_provisioning_error = '';
    }

    await stripe.checkout.sessions.update(session.id, { metadata: metadataUpdate });
    this.logger.log(`[PAYMENT_SUCCESS][END] session=${session.id} provisioned=${metadataUpdate.company_provisioned} mailNotified=${metadataUpdate.payment_success_notified}`);

    return { companyProvisioningResult, mailResults };
  }

  private async handleCheckoutCancelled(inputSession: Stripe.Checkout.Session) {
    const stripe = this.assertStripe();
    const session = await stripe.checkout.sessions.retrieve(inputSession.id);
    this.logger.log(`[PAYMENT_CANCEL][START] session=${session.id} status=${session.status} payment_status=${session.payment_status}`);

    if (session.metadata?.payment_failure_notified === 'true') {
      this.logger.log(`[PAYMENT_CANCEL][SKIP] session=${session.id} payment_failure_notified=true`);
      return { skipped: true, reason: 'already notified' };
    }

    const data = this.fromMetadata(session.metadata || {});
    const email = session.customer_details?.email || data.email;
    const payload = {
      ...data,
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
    };

    const mailResults: Array<unknown> = [];
    if (email) {
      mailResults.push(await this.mail.safeSend('pagamento non riuscito cliente', () => this.mail.sendPaymentFailureCustomer(email, payload)));
    } else {
      this.logger.warn(`[PAYMENT_CANCEL][MAIL][CUSTOMER][SKIP] session=${session.id} email cliente assente`);
    }
    mailResults.push(await this.mail.safeSend('pagamento non riuscito interno', () => this.mail.sendPaymentFailureInternal(payload)));

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...(session.metadata || {}),
        payment_failure_notified: mailResults.some((item: any) => item?.ok) ? 'true' : 'false',
        last_payment_failure_handled_at: new Date().toISOString(),
      },
    });

    this.logger.log(`[PAYMENT_CANCEL][END] session=${session.id} mailNotified=${mailResults.some((item: any) => item?.ok)}`);
    return { mailResults };
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const stripe = this.assertStripe();
    const invoiceAny = invoice as any;
    let metadata: Stripe.Metadata | null | undefined = invoice.metadata;
    let email = typeof invoice.customer_email === 'string' ? invoice.customer_email : undefined;

    const subscriptionId = typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : invoiceAny.subscription?.id;
    this.logger.warn(`[INVOICE_PAYMENT_FAILED][START] invoice=${invoice.id} subscription=${subscriptionId || ''}`);

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      metadata = subscription.metadata || metadata;
      const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
      if (!email && customerId) {
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) email = customer.email || undefined;
      }
    }

    const data = this.fromMetadata(metadata || {});
    const payload = {
      ...data,
      stripeInvoiceId: invoice.id,
      stripeSubscriptionId: subscriptionId,
      invoiceStatus: invoice.status,
    };
    const mailResults: Array<unknown> = [];
    if (email || data.email) {
      mailResults.push(await this.mail.safeSend('invoice payment failed cliente', () => this.mail.sendPaymentFailureCustomer(email || data.email, payload)));
    }
    mailResults.push(await this.mail.safeSend('invoice payment failed interno', () => this.mail.sendPaymentFailureInternal(payload)));
    this.logger.warn(`[INVOICE_PAYMENT_FAILED][END] invoice=${invoice.id} mailNotified=${mailResults.some((item: any) => item?.ok)}`);
  }

  private toMetadata(dto: CheckoutRequest): Record<string, string> {
    return {
      plan: dto.plan,
      companyName: dto.companyName,
      vatNumber: dto.vatNumber,
      contactName: dto.contactName,
      email: dto.email,
      phone: dto.phone || '',
      employees: dto.employees || '',
      address: dto.address || '',
      city: dto.city || '',
      source: 'marketing-site',
      created_at: new Date().toISOString(),
    };
  }

  private fromMetadata(metadata: Stripe.Metadata | Record<string, string>): ProvisionCompanyPayload {
    return {
      plan: metadata.plan || 'team',
      companyName: metadata.companyName || 'Azienda senza nome',
      vatNumber: metadata.vatNumber || '',
      contactName: metadata.contactName || '',
      email: metadata.email || '',
      phone: metadata.phone || undefined,
      employees: metadata.employees || undefined,
      address: metadata.address || undefined,
      city: metadata.city || undefined,
    };
  }

  private maskEmail(value?: string) {
    const [name, domain] = String(value || '').split('@');
    if (!domain) return value || '';
    return `${name.slice(0, 2)}***@${domain}`;
  }
}
