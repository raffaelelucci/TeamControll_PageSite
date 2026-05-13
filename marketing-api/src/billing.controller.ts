import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { IsEmail, IsIn, IsOptional } from 'class-validator';
import Stripe from 'stripe';
import { BillingService } from './billing.service';

class CheckoutDto {
  @IsIn(['starter','team','business']) plan!: string;
  @IsOptional() @IsEmail() email?: string;
}

@Controller('api/billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}
  @Post('create-checkout-session')
  checkout(@Body() dto: CheckoutDto) { return this.billing.checkout(dto.plan, dto.email); }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    // Nota: per produzione configurare raw body nel bootstrap o route dedicata.
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !sig) return { received: true, warning: 'Webhook secret non configurato' };
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const raw = req.rawBody || JSON.stringify(req.body);
    const event = stripe.webhooks.constructEvent(raw, sig, secret);
    if (event.type === 'checkout.session.completed') await this.billing.notifyCheckoutCompleted(event.data.object);
    return { received: true };
  }
}
