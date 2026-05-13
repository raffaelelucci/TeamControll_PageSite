import { Body, Controller, Post } from '@nestjs/common';
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
  constructor(private readonly mail: MailService) {}
  @Post('request-activation')
  async requestActivation(@Body() dto: LeadDto) {
    await this.mail.sendInternalLead('Nuova richiesta Team Control Center', dto);
    await this.mail.sendCustomerAck(dto.email, dto.name);
    return { ok: true };
  }
}
