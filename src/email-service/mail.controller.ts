import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import {
  MailService,
  User,
} from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}
}
