import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class editProfileDto {
  @IsString()
  name: string;
  @IsString()
  country: string;
  @IsString()
  industry: string;
}

export class subscriptionDto {
  @IsString()
  @IsNotEmpty()
  subscribe: SubscriptionTier;
}

export enum SubscriptionTier {
  Free = 'free',
  Basic = 'basic',
  Premium = 'premium',
}

export interface SubscriptionRules {
  maxFilesPerMonth: number;
  maxMembers: number;
  price: number;
}

export class addMembersDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
