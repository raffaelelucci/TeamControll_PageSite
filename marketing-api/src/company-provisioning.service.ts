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

type ProvisioningResult = {
  ok: boolean;
  skipped?: boolean;
  status?: number;
  body?: unknown;
  payload?: unknown;
  reason?: string;
  error?: string;
};

@Injectable()
export class CompanyProvisioningService {
  private readonly logger = new Logger(CompanyProvisioningService.name);

  async createActiveCompany(data: ProvisionCompanyPayload): Promise<ProvisioningResult> {
    const url = this.companyCreateUrl();
    const payload = this.toCompanyPayload(data);
    const safeContext = {
      url,
      method: this.companyCreateMethod(),
      companyName: data.companyName,
      vatNumber: data.vatNumber,
      email: this.maskEmail(data.email),
      plan: data.plan,
      session: data.stripeCheckoutSessionId,
    };

    this.logger.log(`[PROVISIONING][START] ${JSON.stringify(safeContext)}`);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const auth = await this.resolveAuthorizationHeader();

    if (auth) {
      headers.Authorization = auth;
    }

    if (process.env.APP_COMPANY_API_KEY) {
      headers['x-api-key'] = process.env.APP_COMPANY_API_KEY;
    }

    if (!headers.Authorization && !headers['x-api-key']) {
      this.logger.warn(
        '[PROVISIONING][AUTH][MISSING] Nessuna autenticazione configurata. Imposta APP_COMPANY_API_TOKEN oppure APP_ADMIN_USERNAME/APP_ADMIN_PASSWORD.',
      );
    }

    try {
      const response = await this.fetchWithTimeout(
        url,
        {
          method: this.companyCreateMethod(),
          headers,
          body: JSON.stringify(payload),
        },
        this.requestTimeoutMs(),
        '[PROVISIONING][CREATE]',
      );

      const text = await response.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        // risposta non JSON
      }

      if (!response.ok) {
        this.logger.error(
          `[PROVISIONING][KO] status=${response.status} company=${data.companyName} vat=${data.vatNumber} response=${this.truncate(text)}`,
        );
        return {
          ok: false,
          status: response.status,
          body,
          payload,
          error: `Creazione azienda SaaS fallita con status ${response.status}`,
        };
      }

      this.logger.log(`[PROVISIONING][OK] status=${response.status} company=${data.companyName} vat=${data.vatNumber}`);
      return { ok: true, status: response.status, body };
    } catch (error: any) {
      this.logger.error(`[PROVISIONING][ERROR] ${error?.message || error}`, error?.stack);
      return { ok: false, payload, error: error?.message || String(error) };
    }
  }

  private companyCreateUrl() {
    if (process.env.APP_COMPANY_CREATE_URL) return process.env.APP_COMPANY_CREATE_URL;
    const base = this.appApiBaseUrl();
    const url = `${base}/api/companies`;
    this.logger.warn(`[PROVISIONING][CONFIG] APP_COMPANY_CREATE_URL non configurata: uso default ${url}`);
    return url;
  }

  private companyCreateMethod() {
    return process.env.APP_COMPANY_CREATE_METHOD || 'POST';
  }

  private appApiBaseUrl() {
    return (process.env.APP_API_BASE_URL || 'https://api.teamcontrolcenter.it').replace(/\/$/, '');
  }

  private async resolveAuthorizationHeader() {
    if (process.env.APP_COMPANY_API_TOKEN) {
      this.logger.log('[PROVISIONING][AUTH] Uso APP_COMPANY_API_TOKEN');
      return `Bearer ${process.env.APP_COMPANY_API_TOKEN}`;
    }

    const username = process.env.APP_ADMIN_USERNAME;
    const password = process.env.APP_ADMIN_PASSWORD;
    if (!username || !password) return undefined;

    const loginUrl = process.env.APP_AUTH_LOGIN_URL || `${this.appApiBaseUrl()}/api/auth/login`;
    this.logger.log(`[PROVISIONING][AUTH][LOGIN][START] url=${loginUrl} username=${username}`);

    try {
      const response = await this.fetchWithTimeout(
        loginUrl,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        },
        this.requestTimeoutMs(),
        '[PROVISIONING][AUTH][LOGIN]',
      );
      const text = await response.text();
      let body: any = {};
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = { raw: text };
      }

      if (!response.ok || !body.accessToken) {
        this.logger.error(`[PROVISIONING][AUTH][LOGIN][KO] status=${response.status} response=${this.truncate(text)}`);
        return undefined;
      }

      this.logger.log('[PROVISIONING][AUTH][LOGIN][OK] Token JWT ottenuto per creazione azienda');
      return `Bearer ${body.accessToken}`;
    } catch (error: any) {
      this.logger.error(`[PROVISIONING][AUTH][LOGIN][ERROR] ${error?.message || error}`, error?.stack);
      return undefined;
    }
  }

  private toCompanyPayload(data: ProvisionCompanyPayload) {
    const plan = String(data.plan || 'team').toLowerCase();
    const limits = this.planLimits(plan);
    const address = [data.address, data.city].filter(Boolean).join(' - ') || null;

    return {
      name: data.companyName,
      vatNumber: data.vatNumber || null,
      email: data.email || null,
      phone: data.phone || null,
      address,
      description: `Azienda attivata da pagamento Stripe. Referente: ${data.contactName || '-'}; sessione: ${data.stripeCheckoutSessionId || '-'}`,
      active: true,
      isFreeSubscription: false,
      isDemoCompany: false,
      subscriptionPlan: plan.toUpperCase(),
      subscriptionStatus: 'ACTIVE',
      billingEmail: data.email || null,
      maxUsers: limits.maxUsers,
      maxProjects: limits.maxProjects,
      maxStorageMb: limits.maxStorageMb,
      stripeCustomerId: data.stripeCustomerId || null,
      stripeSubscriptionId: data.stripeSubscriptionId || null,
      stripeCheckoutSessionId: data.stripeCheckoutSessionId || null,
      source: 'marketing-site-stripe-checkout',
    };
  }

  private planLimits(plan: string) {
    const map: Record<string, { maxUsers: number; maxProjects: number; maxStorageMb: number }> = {
      starter: { maxUsers: 5, maxProjects: 8, maxStorageMb: 1024 },
      team: { maxUsers: 20, maxProjects: 50, maxStorageMb: 5120 },
      business: { maxUsers: 50, maxProjects: 200, maxStorageMb: 20480 },
    };
    return map[plan] || map.team;
  }


  private requestTimeoutMs() {
    const parsed = Number(process.env.APP_PROVISIONING_TIMEOUT_MS || 10000);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 10000;
  }

  private async fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number, label: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      this.logger.log(`${label}[HTTP][START] url=${url} timeoutMs=${timeoutMs}`);
      const response = await fetch(url, { ...init, signal: controller.signal });
      this.logger.log(`${label}[HTTP][END] status=${response.status} durationMs=${Date.now() - started}`);
      return response;
    } catch (error: any) {
      const message = error?.name === 'AbortError' ? `Timeout dopo ${timeoutMs}ms` : error?.message || String(error);
      this.logger.error(`${label}[HTTP][ERROR] durationMs=${Date.now() - started} error=${message}`, error?.stack);
      throw new Error(message);
    } finally {
      clearTimeout(timeout);
    }
  }

  private truncate(value: string, max = 1200) {
    if (!value) return '';
    return value.length > max ? `${value.slice(0, max)}...` : value;
  }

  private maskEmail(value?: string) {
    const [name, domain] = String(value || '').split('@');
    if (!domain) return value || '';
    return `${name.slice(0, 2)}***@${domain}`;
  }
}
