import { BadRequestException, Body, Controller, Logger, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { MailService } from './mail.service';

const MAX_CONTACT_FILES = 5;
const MAX_CONTACT_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_CONTACT_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
  'image/png',
  'image/jpeg',
  'application/octet-stream'
]);
const ALLOWED_CONTACT_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'png', 'jpg', 'jpeg']);

function isAllowedContactFile(file: { originalname?: string; mimetype?: string }) {
  const extension = String(file.originalname || '').split('.').pop()?.toLowerCase() || '';
  return ALLOWED_CONTACT_MIME_TYPES.has(String(file.mimetype || '')) && ALLOWED_CONTACT_EXTENSIONS.has(extension);
}

class ContactDto {
  @IsString() @IsNotEmpty() @MaxLength(80) firstName!: string;
  @IsString() @IsNotEmpty() @MaxLength(80) lastName!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() @MaxLength(140) company!: string;
  @IsString() @IsNotEmpty() @MaxLength(180) subject!: string;
  @IsString() @IsNotEmpty() @MaxLength(5000) message!: string;
  @IsOptional() @IsString() @MaxLength(80) source?: string;
}

type ContactUpload = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('api/contacts')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly mail: MailService) {}

  @Post('request')
  @UseInterceptors(
    FilesInterceptor('documents', MAX_CONTACT_FILES, {
      limits: {
        files: MAX_CONTACT_FILES,
        fileSize: MAX_CONTACT_FILE_SIZE,
        fieldSize: 5200
      },
      fileFilter: (_req, file, callback) => {
        if (isAllowedContactFile(file)) {
          callback(null, true);
          return;
        }
        callback(new BadRequestException('Formato allegato non supportato. Usa PDF, Word, Excel, CSV, TXT, PNG o JPG.'), false);
      }
    })
  )
  async requestContact(@Body() dto: ContactDto, @UploadedFiles() documents: ContactUpload[] = []) {
    this.logger.log(
      `[CONTACT][REQUEST][START] company=${this.mask(dto.company)} email=${this.maskEmail(dto.email)} files=${documents.length}`,
    );

    const internalMail = await this.mail.safeSend('contatto sito interno', async () => {
      await this.mail.sendInternalContactRequest(dto, documents);
    });

    const customerMail = await this.mail.safeSend('contatto sito ack cliente', async () => {
      await this.mail.sendContactAck(dto.email, `${dto.firstName} ${dto.lastName}`.trim());
    });

    this.logger.log(
      `[CONTACT][REQUEST][END] company=${this.mask(dto.company)} internalMail=${internalMail.ok} customerMail=${customerMail.ok}`,
    );

    return {
      ok: true,
      received: true,
      mailNotified: internalMail.ok && customerMail.ok,
      internalMail: internalMail.ok,
      customerMail: customerMail.ok,
      attachments: documents.length
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
