import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './email-service/mail.module';
import { SubscriptionModule } from './Service/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    AuthModule,
    UserModule,
    SubscriptionModule,
    PrismaModule,
  ],
})
export class AppModule {}
