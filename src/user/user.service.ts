import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { MailService } from 'src/email-service/mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscriptionService } from 'src/Service/subscription/subscription.service';
import {
  ChangePasswordDto,
  addMembersDto,
  editProfileDto,
  subscriptionDto,
} from './dto/acountDtos';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private subService: SubscriptionService,
    private mailerService: MailerService,
    private authService: AuthService,
  ) {}

  //gets current subscription plan
  async getSubscriptionPlan(user: Company) {
    let company =
      await this.prisma.company.findUnique({
        where: {
          email: user.email,
        },
      });
    if (company.subscriptionTier === null) {
      return "You currently don't have a subscription plan";
    } else {
      return await this.prisma.subscription.findUnique(
        {
          where: {
            id: company.id,
          },
        },
      );
    }
  }

  //change password
  async changePassword(
    user: Company,
    dto: ChangePasswordDto,
  ) {
    let company =
      await this.prisma.company.findUnique({
        where: {
          email: user.email,
        },
      });
    const pwMatches = await argon.verify(
      company.hash,
      dto.oldPassword,
    );
    if (!pwMatches) {
      throw new ForbiddenException(
        'Wrong password!',
      );
    }
    const newPassWordHash = await argon.hash(
      dto.newPassword,
    );
    await this.prisma.company.update({
      where: {
        email: user.email,
      },
      data: { hash: newPassWordHash },
    });
    return 'Password Updated!';
  }
  //edit profile
  async editProfile(
    user: Company,
    dto: editProfileDto,
  ) {
    let company =
      await this.prisma.company.update({
        where: {
          email: user.email,
        },
        data: {
          updatedAt: new Date(),
          name: dto.name,
          country: dto.country,
          industry: dto.industry,
        },
      });
    delete company.hash;

    return company;
  }

  //choose subscription plan
  async subscribe(
    user: Company,
    dto: subscriptionDto,
  ) {
    try {
      const userCompany =
        await this.prisma.company.findUnique({
          where: {
            email: user.email,
          },
        });
      const rules =
        this.subService.getSubscriptionRules(
          dto.subscribe,
        );

      const checkIfSubscriptionExists =
        await this.prisma.subscription.findUnique(
          {
            where: {
              companyId: userCompany.id,
            },
          },
        );

      if (checkIfSubscriptionExists) {
        throw new HttpException(
          'Subscription already exists',
          HttpStatus.FORBIDDEN,
        );
      }
      const subscription =
        await this.prisma.subscription.create({
          data: {
            tier: dto.subscribe,
            maxFilesPerMonth:
              rules.maxFilesPerMonth,
            maxMembers: rules.maxMembers,
            price: rules.price,
            companyId: userCompany.id,
          },
        });
      console.log(subscription, 'sub');
      await this.prisma.company.update({
        where: {
          email: user.email,
        },
        data: {
          subscriptionTier: dto.subscribe,
        },
      });
      return subscription;
    } catch (err) {
      return err;
    }
  }

  //upgrade or downgrade subscription plan
  async changeSubscriptionPlan(
    user: Company,
    dto: subscriptionDto,
  ) {
    try {
      const userCompany =
        await this.prisma.company.findUnique({
          where: {
            email: user.email,
          },
        });

      const rules =
        this.subService.getSubscriptionRules(
          dto.subscribe,
        );

      let currentSubscription =
        await this.prisma.subscription.findUnique(
          {
            where: {
              companyId: userCompany.id,
            },
          },
        );
      if (
        currentSubscription.tier === dto.subscribe
      ) {
        throw new HttpException(
          'Subscription already exists',
          HttpStatus.FORBIDDEN,
        );
      }
      //updates subscription model

      await this.prisma.subscription.update({
        where: {
          companyId: userCompany.id,
        },
        data: {
          tier: dto.subscribe,
          maxFilesPerMonth:
            rules.maxFilesPerMonth,
          maxMembers: rules.maxMembers,
          price: rules.price,
          updatedAt: new Date(),
        },
      });

      await this.prisma.company.update({
        where: {
          email: user.email,
        },
        data: {
          subscriptionTier: dto.subscribe,
        },
      });
      return 'Subscription plan updated!';
    } catch (err) {
      return err;
    }
  }
  //get current company members
  async getMembers(user: Company) {
    return await this.prisma.coworker.findMany({
      where: {
        companyId: user.id,
      },
    });
  }

  //add new members
  async addMembers(
    user: Company,
    dto: addMembersDto,
  ) {
    const hash = await argon.hash(dto.password);
    let coworker =
      await this.prisma.coworker.create({
        data: {
          email: dto.email,
          hash,
          name: dto.name,
          companyId: user.id,
        },
      });

    let token = await this.authService.signToken(
      coworker.id,
      coworker.email,
    );
    const url = `http://localhost:3333/auth/verify/${token.access_token}`;
    await this.mailerService.sendMail({
      to: dto.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject:
        'Welcome! Confirm your Email and login on adress: ',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: coworker.name,
        url,
      },
    });
    await this.prisma.emailVerification.create({
      data: {
        email: dto.email,
        token: token.access_token,
      },
    });
    return 'Member added and Verification mail has been sent!';
  }
}
