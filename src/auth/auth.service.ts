import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/email-service/mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailerService: MailerService,
  ) {}
  login() {}

  async signup(dto: AuthDto) {
    //generate passwrod hashs
    const hash = await argon.hash(dto.password);
    //save new yser in db
    try {
      const user =
        await this.prisma.company.create({
          data: {
            email: dto.email,
            hash,
            name: dto.name,
            country: dto.country,
            industry: dto.industry,
          },
        });
      let token = await this.signToken(
        user.id,
        user.email,
      );
      const url = `http://localhost:3333/auth/verify/${token.access_token}`;
      await this.mailerService.sendMail({
        to: dto.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome! Confirm your Email',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: dto.name,
          url,
        },
      });

      await this.prisma.emailVerification.create({
        data: {
          email: dto.email,
          token: token.access_token,
        },
      });
      return 'Verification mail has been sent!';
    } catch (err) {
      if (
        err instanceof
        PrismaClientKnownRequestError
      ) {
        if (err.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw err;
    }
  }
  async signin(dto: AuthDto) {
    //find user by email
    const user =
      await this.prisma.company.findUnique({
        where: {
          email: dto.email,
        },
      });
    //if user dont exist throw exeption
    if (!user) {
      throw new ForbiddenException(
        'Credentials Incorrect',
      );
    }
    //compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    //if password incorrect we throw exeption
    if (!pwMatches) {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }

    //send back user
    return this.signToken(user.id, user.email);
  }
  //generates token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payLoad = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payLoad,
      {
        expiresIn: '30m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }

  //verifies account
  async verifyAccount(tokenId: string) {
    let emailToVerify =
      await this.prisma.emailVerification.findUnique(
        {
          where: {
            token: tokenId,
          },
        },
      );
    if (emailToVerify && emailToVerify.email) {
      await this.prisma.company.update({
        where: {
          email: emailToVerify.email,
        },
        data: { verified: true },
      });
      await this.prisma.emailVerification.delete({
        where: {
          token: tokenId,
        },
      });
    } else {
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    }
    return 'Account Activated';
  }

  async validateAccount(email) {
    let accToVerify =
      await this.prisma.company.findUnique({
        where: {
          email: email,
        },
      });
    return accToVerify;
  }
}
