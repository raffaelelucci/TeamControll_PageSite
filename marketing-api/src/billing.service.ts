import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { MailService } from './mail.service';

@Injectable()
export class BillingService {
  private stripe?: Stripe;
  constructor(private readonly mail: MailService) {
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
  async checkout(plan: string, customerEmail?: string) {
    const price = this.priceFor(plan);
    if (!this.stripe || !price) throw new BadRequestException('Pagamento online non ancora configurato. Usa il form demo/contatti.');
    const base = process.env.PUBLIC_SITE_URL || 'https://teamcontrolcenter.it';
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [{ price, quantity: 1 }],
      success_url: `${base}/demo?checkout=success`,
      cancel_url: `${base}/prezzi?checkout=cancel`,
      metadata: { plan, source: 'marketing-site' },
      subscription_data: { metadata: { plan, source: 'marketing-site' } },
    });
    return { url: session.url };
  }
  async notifyCheckoutCompleted(payload: unknown) {
    await this.mail.sendInternalLead('Pagamento abbonamento completato', { payload });
  }
}
