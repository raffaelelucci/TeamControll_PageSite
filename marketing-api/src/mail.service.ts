import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter() {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }

  private from() {
    return process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@teamcontrolcenter.it';
  }

  private internalTo() {
    return process.env.INTERNAL_PAYMENT_EMAIL || process.env.SALES_TO_EMAIL || process.env.SMTP_USER;
  }

  async sendInternalLead(subject: string, payload: object) {
    const to = this.internalTo();
    if (!to) { this.logger.warn('Nessuna mail interna configurata: imposta INTERNAL_PAYMENT_EMAIL, SALES_TO_EMAIL o SMTP_USER'); return; }
    const html = `<h2>${subject}</h2><pre style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:16px;border-radius:12px;white-space:pre-wrap">${JSON.stringify(payload, null, 2)}</pre>`;
    await this.transporter().sendMail({ from: this.from(), to, subject, html });
  }

  async sendCustomerAck(to: string, name: string) {
    await this.transporter().sendMail({
      from: this.from(), to,
      subject: 'Richiesta ricevuta - Team Control Center',
      html: `<p>Ciao ${this.escape(name)},</p><p>abbiamo ricevuto la tua richiesta. Ti contatteremo per configurare la prova o l’abbonamento aziendale.</p><p>Team Control Center</p>`
    });
  }

  async sendPaymentSuccessCustomer(to: string, data: Record<string, unknown>) {
    await this.transporter().sendMail({
      from: this.from(),
      to,
      subject: 'Pagamento ricevuto - Team Control Center',
      html: `
        <h2>Pagamento ricevuto correttamente</h2>
        <p>Ciao ${this.escape(String(data.contactName || ''))},</p>
        <p>il pagamento per il piano <strong>${this.escape(String(data.plan || ''))}</strong> è stato completato.</p>
        <p>L’azienda <strong>${this.escape(String(data.companyName || ''))}</strong> risulta ora in fase di attivazione/registrazione nel sistema Team Control Center.</p>
        <p>A breve potrai completare la configurazione dell’accesso amministratore aziendale.</p>
        <p>Team Control Center</p>
      `,
    });
  }

  async sendPaymentFailureCustomer(to: string, data: Record<string, unknown>) {
    await this.transporter().sendMail({
      from: this.from(),
      to,
      subject: 'Pagamento non completato - Team Control Center',
      html: `
        <h2>Pagamento non completato</h2>
        <p>Ciao ${this.escape(String(data.contactName || ''))},</p>
        <p>il pagamento per il piano <strong>${this.escape(String(data.plan || ''))}</strong> non è stato completato correttamente.</p>
        <p>L’azienda non viene attivata finché il pagamento non va a buon fine. Puoi riprovare dalla pagina prezzi.</p>
        <p>Team Control Center</p>
      `,
    });
  }

  async sendPaymentSuccessInternal(data: Record<string, unknown>) {
    await this.sendInternalLead('Pagamento completato e azienda da attivare', data);
  }

  async sendPaymentFailureInternal(data: Record<string, unknown>) {
    await this.sendInternalLead('Pagamento non completato / fallito', data);
  }

  private escape(value: string) {
    return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));
  }
}
