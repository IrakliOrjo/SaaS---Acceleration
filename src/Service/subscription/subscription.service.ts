import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SubscriptionRules,
  SubscriptionTier,
} from 'src/user/dto/acountDtos';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  getSubscriptionRules(
    tier: SubscriptionTier,
  ): SubscriptionRules {
    switch (tier) {
      case SubscriptionTier.Free:
        return {
          maxFilesPerMonth: 10,
          maxMembers: 1,
          price: 0,
        };
      case SubscriptionTier.Basic:
        return {
          maxFilesPerMonth: 100,
          maxMembers: 10,
          price: 0,
        };
      case SubscriptionTier.Premium:
        return {
          maxFilesPerMonth: 1000,
          maxMembers: 10000000,
          price: 300,
        };
      default:
        throw new Error(
          'Invalid subscription tier',
        );
    }
  }
}
