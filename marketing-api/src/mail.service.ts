import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

type MailAttachment = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

type ContactMailPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
  source?: string;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private smtpConfig() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secureEnv = String(process.env.SMTP_SECURE || '').trim().toLowerCase();
    const secure = port === 465 || ['true', '1', 'yes', 'y'].includes(secureEnv);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (port === 465 && secureEnv === 'false') {
      this.logger.warn('SMTP_PORT=465 richiede TLS implicito: forzo secure=true anche se SMTP_SECURE=false');
    }

    return { host, port, secure, user, pass };
  }

  private transporter() {
    const smtp = this.smtpConfig();

    if (!smtp.host) {
      throw new Error('SMTP_HOST non configurato');
    }

    this.logger.log(
      `Creo transporter SMTP host=${smtp.host} port=${smtp.port} secure=${smtp.secure} auth=${smtp.user ? 'yes' : 'no'}`,
    );

    return nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: smtp.user ? { user: smtp.user, pass: smtp.pass || '' } : undefined,
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT_MS || 10000),
      greetingTimeout: Number(process.env.SMTP_GREETING_TIMEOUT_MS || 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT_MS || 15000),
    });
  }

  private from() {
    return process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@teamcontrolcenter.it';
  }

  private internalTo() {
    return process.env.INTERNAL_PAYMENT_EMAIL || process.env.SALES_TO_EMAIL || process.env.SMTP_USER;
  }

  private contactTo() {
    return process.env.CONTACT_TO_EMAIL || process.env.SALES_TO_EMAIL || process.env.INTERNAL_PAYMENT_EMAIL || process.env.SMTP_USER;
  }

  async safeSend(label: string, fn: () => Promise<void>) {
    try {
      await fn();
      this.logger.log(`[MAIL][OK] ${label}`);
      return { ok: true, label };
    } catch (error: any) {
      this.logger.error(`[MAIL][KO] ${label}: ${error?.message || error}`, error?.stack);
      return { ok: false, label, error: error?.message || String(error) };
    }
  }

  async sendInternalLead(subject: string, payload: object) {
    const to = this.internalTo();
    if (!to) {
      throw new Error('Nessuna mail interna configurata: imposta INTERNAL_PAYMENT_EMAIL, SALES_TO_EMAIL o SMTP_USER');
    }

    this.logger.log(`[MAIL][START] Invio mail interna to=${this.maskEmail(to)} subject="${subject}"`);
    const html = `<h2>${this.escape(subject)}</h2><pre style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:16px;border-radius:12px;white-space:pre-wrap">${this.escape(JSON.stringify(payload, null, 2))}</pre>`;
    await this.transporter().sendMail({ from: this.from(), to, subject, html });
  }

  async sendCustomerAck(to: string, name: string) {
    this.logger.log(`[MAIL][START] Invio ack cliente to=${this.maskEmail(to)}`);
    await this.transporter().sendMail({
      from: this.from(),
      to,
      subject: 'Richiesta ricevuta - Team Control Center',
      html: `<p>Ciao ${this.escape(name)},</p><p>abbiamo ricevuto la tua richiesta. Ti contatteremo per configurare la prova o l’abbonamento aziendale.</p><p>Team Control Center</p>`,
    });
  }

  async sendInternalContactRequest(payload: ContactMailPayload, attachments: MailAttachment[] = []) {
    const to = this.contactTo();
    if (!to) {
      throw new Error('Nessuna mail contatti configurata: imposta CONTACT_TO_EMAIL, SALES_TO_EMAIL, INTERNAL_PAYMENT_EMAIL o SMTP_USER');
    }

    const subject = `Nuovo contatto sito - ${payload.subject || 'Team Control Center'}`;
    this.logger.log(`[MAIL][START] Invio contatto interno to=${this.maskEmail(to)} subject="${subject}" attachments=${attachments.length}`);

    const rows = [
      ['Nome', `${payload.firstName || ''} ${payload.lastName || ''}`.trim()],
      ['Email', payload.email || ''],
      ['Azienda', payload.company || ''],
      ['Oggetto', payload.subject || ''],
      ['Origine', payload.source || 'contatti'],
      ['Allegati', attachments.length ? attachments.map((file) => `${file.originalname} (${Math.round(file.size / 1024)} KB)`).join(', ') : 'Nessun allegato']
    ];

    const html = `
      <h2>Nuova richiesta di contatto dal sito</h2>
      <table style="font-family:Inter,Arial,sans-serif;border-collapse:collapse;width:100%;max-width:760px">
        ${rows.map(([label, value]) => `<tr><th style="text-align:left;border:1px solid #dbe5f2;padding:10px;background:#f8fafc;width:180px">${this.escape(label)}</th><td style="border:1px solid #dbe5f2;padding:10px">${this.escape(value)}</td></tr>`).join('')}
      </table>
      <h3>Messaggio</h3>
      <pre style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:16px;border-radius:12px;white-space:pre-wrap">${this.escape(payload.message || '')}</pre>
    `;

    await this.transporter().sendMail({
      from: this.from(),
      to,
      replyTo: payload.email,
      subject,
      html,
      attachments: attachments.map((file) => ({
        filename: this.sanitizeFilename(file.originalname),
        content: file.buffer,
        contentType: file.mimetype
      }))
    });
  }

  async sendContactAck(to: string, name: string) {
    this.logger.log(`[MAIL][START] Invio ack contatto cliente to=${this.maskEmail(to)}`);
    await this.transporter().sendMail({
      from: this.from(),
      to,
      subject: 'Messaggio ricevuto - Team Control Center',
      html: `
        <p>Ciao ${this.escape(name || '')},</p>
        <p>abbiamo ricevuto il tuo messaggio tramite la sezione Contattaci di Team Control Center.</p>
        <p>Ti risponderemo appena possibile con le informazioni più utili per la tua azienda.</p>
        <p>Team Control Center</p>
      `
    });
  }

  async sendPaymentSuccessCustomer(to: string, data: Record<string, unknown>) {
    this.logger.log(`[MAIL][START] Invio pagamento riuscito cliente to=${this.maskEmail(to)} session=${data.stripeSessionId || ''}`);
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
    this.logger.log(`[MAIL][START] Invio pagamento non riuscito cliente to=${this.maskEmail(to)} session=${data.stripeSessionId || ''}`);
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
    await this.sendInternalLead('Pagamento completato - azienda creata/da verificare', data);
  }

  async sendPaymentFailureInternal(data: Record<string, unknown>) {
    await this.sendInternalLead('Pagamento non completato / fallito', data);
  }

  private sanitizeFilename(value: string) {
    return String(value || 'allegato')
      .replace(/[^a-zA-Z0-9._\- àèéìòùÀÈÉÌÒÙ]/g, '_')
      .slice(0, 140) || 'allegato';
  }

  private maskEmail(value: string) {
    const [name, domain] = String(value || '').split('@');
    if (!domain) return value;
    return `${name.slice(0, 2)}***@${domain}`;
  }

  private escape(value: string) {
    return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));
  }
}
