import { Body, Controller, Headers, Logger, Post, Req } from '@nestjs/common';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import Stripe from 'stripe';
import { BillingService } from './billing.service';

class CheckoutDto {
  @IsIn(['starter','team','business']) plan!: 'starter' | 'team' | 'business';
  @IsString() @IsNotEmpty() @MaxLength(140) companyName!: string;
  @IsString() @IsNotEmpty() @MaxLength(40) vatNumber!: string;
  @IsString() @IsNotEmpty() @MaxLength(120) contactName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(40) employees?: string;
  @IsOptional() @IsString() @MaxLength(160) address?: string;
  @IsOptional() @IsString() @MaxLength(90) city?: string;
}

class CheckoutResultDto {
  @IsString() @IsNotEmpty() sessionId!: string;
  @IsIn(['success','cancel']) result!: 'success' | 'cancel';
}

@Controller('api/billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private readonly billing: BillingService) {}

  @Post('create-checkout-session')
  checkout(@Body() dto: CheckoutDto) {
    this.logger.log(`[HTTP][create-checkout-session] plan=${dto.plan} company=${dto.companyName}`);
    return this.billing.checkout(dto);
  }

  @Post('checkout-result')
  checkoutResult(@Body() dto: CheckoutResultDto) {
    this.logger.log(`[HTTP][checkout-result] session=${dto.sessionId} result=${dto.result}`);
    return this.billing.notifyCheckoutResult(dto.sessionId, dto.result);
  }

  @Post('webhook')
  webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !sig) {
      this.logger.warn('[STRIPE_WEBHOOK][SKIP] Webhook secret o firma assenti');
      return { received: true, warning: 'Webhook secret non configurato' };
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const raw = req.rawBody;
    this.logger.log(`[STRIPE_WEBHOOK][RECEIVED] rawBody=${raw ? 'yes' : 'no'} signature=yes`);
    const event = stripe.webhooks.constructEvent(raw, sig, secret);

    // Importante: rispondiamo subito a Stripe. Provisioning azienda e mail girano asincroni
    // con log dedicati, così nginx/Stripe non vanno in timeout se l'altro progetto o SMTP sono lenti.
    this.billing.handleStripeEvent(event).catch((error: any) => {
      this.logger.error(`[STRIPE_WEBHOOK][ASYNC_KO] event=${event.id} type=${event.type} error=${error?.message || error}`, error?.stack);
    });

    return { received: true, queued: true, eventId: event.id, eventType: event.type };
  }
}
