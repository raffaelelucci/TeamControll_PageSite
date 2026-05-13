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

    return { url: session.url };
  }

  async notifyCheckoutResult(sessionId: string, result: 'success' | 'cancel') {
    const stripe = this.assertStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (result === 'success') {
      if (session.status !== 'complete' && session.payment_status !== 'paid') {
        return { status: 'pending', message: 'Pagamento non ancora confermato da Stripe.' };
      }
      await this.handleCheckoutCompleted(session);
      return { status: 'success', message: 'Pagamento completato correttamente.' };
    }

    await this.handleCheckoutCancelled(session);
    return { status: 'cancel', message: 'Pagamento non completato.' };
  }

  async handleStripeEvent(event: Stripe.Event) {
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
        break;
    }
  }

  private async handleCheckoutCompleted(inputSession: Stripe.Checkout.Session) {
    const stripe = this.assertStripe();
    const session = await stripe.checkout.sessions.retrieve(inputSession.id);
    const data = this.fromMetadata(session.metadata || {});
    const alreadyHandled = session.metadata?.payment_success_notified === 'true' && session.metadata?.company_provisioned === 'true';
    if (alreadyHandled) return;

    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const stripeSubscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    const email = session.customer_details?.email || data.email;

    let companyProvisioningResult: unknown = { skipped: true };
    if (session.metadata?.company_provisioned !== 'true') {
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

    if (email && session.metadata?.payment_success_notified !== 'true') {
      await this.mail.sendPaymentSuccessCustomer(email, payload);
      await this.mail.sendPaymentSuccessInternal(payload);
    }

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...(session.metadata || {}),
        payment_success_notified: 'true',
        company_provisioned: 'true',
      },
    });
  }

  private async handleCheckoutCancelled(inputSession: Stripe.Checkout.Session) {
    const stripe = this.assertStripe();
    const session = await stripe.checkout.sessions.retrieve(inputSession.id);
    if (session.metadata?.payment_failure_notified === 'true') return;

    const data = this.fromMetadata(session.metadata || {});
    const email = session.customer_details?.email || data.email;
    const payload = {
      ...data,
      stripeSessionId: session.id,
      paymentStatus: session.payment_status,
      status: session.status,
    };

    if (email) await this.mail.sendPaymentFailureCustomer(email, payload);
    await this.mail.sendPaymentFailureInternal(payload);

    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        ...(session.metadata || {}),
        payment_failure_notified: 'true',
      },
    });
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const stripe = this.assertStripe();
    const invoiceAny = invoice as any;
    let metadata: Stripe.Metadata | null | undefined = invoice.metadata;
    let email = typeof invoice.customer_email === 'string' ? invoice.customer_email : undefined;

    const subscriptionId = typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : invoiceAny.subscription?.id;
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
    if (email || data.email) await this.mail.sendPaymentFailureCustomer(email || data.email, payload);
    await this.mail.sendPaymentFailureInternal(payload);
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
    };
  }

  private fromMetadata(metadata: Stripe.Metadata | Record<string, string>): ProvisionCompanyPayload {
    return {
      plan: metadata.plan || 'starter',
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
}
