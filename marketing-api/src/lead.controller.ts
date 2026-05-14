import { Body, Controller, Logger, Post } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { MailService } from './mail.service';

class LeadDto {
  @IsString() @MaxLength(120) company!: string;
  @IsString() @MaxLength(120) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(40) employees?: string;
  @IsOptional() @IsString() @MaxLength(2000) message?: string;
  @IsOptional() @IsString() @MaxLength(80) source?: string;
}

@Controller('api/leads')
export class LeadController {
  private readonly logger = new Logger(LeadController.name);

  constructor(private readonly mail: MailService) {}

  @Post('request-activation')
  async requestActivation(@Body() dto: LeadDto) {
    this.logger.log(`[LEAD][REQUEST_ACTIVATION][START] company=${this.mask(dto.company)} email=${this.maskEmail(dto.email)} source=${dto.source || ''}`);

    const internalMail = await this.mail.safeSend('lead demo interno', async () => {
      await this.mail.sendInternalLead('Nuova richiesta Team Control Center', dto);
    });

    const customerMail = await this.mail.safeSend('lead demo ack cliente', async () => {
      await this.mail.sendCustomerAck(dto.email, dto.name);
    });

    const mailNotified = internalMail.ok && customerMail.ok;

    this.logger.log(
      `[LEAD][REQUEST_ACTIVATION][END] company=${this.mask(dto.company)} internalMail=${internalMail.ok} customerMail=${customerMail.ok}`,
    );

    return {
      ok: true,
      received: true,
      mailNotified,
      internalMail: internalMail.ok,
      customerMail: customerMail.ok,
    };
  }

  private mask(value?: string) {
    const text = String(value || '');
    if (text.length <= 3) return text;
    return `${text.slice(0, 3)}***`;
  }

  private maskEmail(value?: string) {
    const [name, domain] = String(value || '').split('@');
    if (!domain) return this.mask(value);
    return `${name.slice(0, 2)}***@${domain}`;
  }
}
