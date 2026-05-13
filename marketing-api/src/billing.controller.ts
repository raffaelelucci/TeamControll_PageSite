import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
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
  constructor(private readonly billing: BillingService) {}

  @Post('create-checkout-session')
  checkout(@Body() dto: CheckoutDto) {
    return this.billing.checkout(dto);
  }

  @Post('checkout-result')
  checkoutResult(@Body() dto: CheckoutResultDto) {
    return this.billing.notifyCheckoutResult(dto.sessionId, dto.result);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') sig?: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret || !sig) return { received: true, warning: 'Webhook secret non configurato' };

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const raw = req.rawBody;
    const event = stripe.webhooks.constructEvent(raw, sig, secret);
    await this.billing.handleStripeEvent(event);
    return { received: true };
  }
}
