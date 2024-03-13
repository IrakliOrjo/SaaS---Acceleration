import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface User {
  email: string;
  name: string;
}

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
  ) {}

  async sendUserConfirmation(dto: User) {
    const url = `example.com/auth/confirm?token=`;

    await this.mailerService.sendMail({
      to: dto.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: dto.name,
        url,
      },
    });
  }

  sendMail() {}
}
