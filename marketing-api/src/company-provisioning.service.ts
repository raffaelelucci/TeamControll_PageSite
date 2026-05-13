import { Injectable, Logger } from '@nestjs/common';

export type ProvisionCompanyPayload = {
  plan: string;
  companyName: string;
  vatNumber: string;
  contactName: string;
  email: string;
  phone?: string;
  employees?: string;
  address?: string;
  city?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCheckoutSessionId?: string;
};

@Injectable()
export class CompanyProvisioningService {
  private readonly logger = new Logger(CompanyProvisioningService.name);

  async createActiveCompany(data: ProvisionCompanyPayload) {
    const url = process.env.APP_COMPANY_CREATE_URL;
    if (!url) {
      this.logger.warn('APP_COMPANY_CREATE_URL non configurata: salto la creazione azienda nel SaaS');
      return { skipped: true, reason: 'APP_COMPANY_CREATE_URL not configured' };
    }

    const payload = {
      name: data.companyName,
      businessName: data.companyName,
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      taxCode: data.vatNumber,
      fiscalCode: data.vatNumber,
      email: data.email,
      phone: data.phone || null,
      employees: data.employees || null,
      address: data.address || null,
      city: data.city || null,
      status: 'ACTIVE',
      active: true,
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: data.plan,
      plan: data.plan,
      stripeCustomerId: data.stripeCustomerId || null,
      stripeSubscriptionId: data.stripeSubscriptionId || null,
      stripeCheckoutSessionId: data.stripeCheckoutSessionId || null,
      source: 'marketing-site-stripe-checkout'
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.APP_COMPANY_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.APP_COMPANY_API_TOKEN}`;
    }
    if (process.env.APP_COMPANY_API_KEY) {
      headers['x-api-key'] = process.env.APP_COMPANY_API_KEY;
    }

    const response = await fetch(url, {
      method: process.env.APP_COMPANY_CREATE_METHOD || 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let body: unknown = text;
    try { body = text ? JSON.parse(text) : {}; } catch { /* response non JSON */ }

    if (!response.ok) {
      this.logger.error(`Creazione azienda SaaS fallita: ${response.status} ${text}`);
      throw new Error(`Creazione azienda SaaS fallita con status ${response.status}`);
    }

    return { ok: true, status: response.status, body };
  }
}
