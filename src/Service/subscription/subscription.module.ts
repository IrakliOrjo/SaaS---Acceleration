import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionService } from './subscription.service';

@Global()
@Module({
  imports: [PrismaModule],

  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
