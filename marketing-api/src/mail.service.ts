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
  async sendInternalLead(subject: string, payload: unknown) {
    const to = process.env.SALES_TO_EMAIL;
    if (!to) { this.logger.warn('SALES_TO_EMAIL non configurata'); return; }
    const html = `<h2>${subject}</h2><pre style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:16px;border-radius:12px">${JSON.stringify(payload, null, 2)}</pre>`;
    await this.transporter().sendMail({ from: process.env.MAIL_FROM || 'noreply@teamcontrolcenter.it', to, subject, html });
  }
  async sendCustomerAck(to: string, name: string) {
    await this.transporter().sendMail({
      from: process.env.MAIL_FROM || 'noreply@teamcontrolcenter.it', to,
      subject: 'Richiesta ricevuta - Team Control Center',
      html: `<p>Ciao ${name},</p><p>abbiamo ricevuto la tua richiesta. Ti contatteremo per configurare la prova o l’abbonamento aziendale.</p><p>Team Control Center</p>`
    });
  }
}
