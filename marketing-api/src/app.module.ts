import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { LeadController } from './lead.controller';
import { BillingService } from './billing.service';
import { MailService } from './mail.service';
import { CompanyProvisioningService } from './company-provisioning.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [BillingController, LeadController],
  providers: [BillingService, MailService, CompanyProvisioningService],
})
export class AppModule {}
