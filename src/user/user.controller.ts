import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  addMembersDto,
  editProfileDto,
  subscriptionDto,
} from './dto/acountDtos';

@UseGuards(JwtGuard)
@Controller('account')
export class UserController {
  constructor(private userService: UserService) {}

  //gets current account info
  @Get('me')
  getMe(@GetUser() user: Company) {
    return user;
  }

  //gets current subscription plan
  @Get('subscriptionPlan')
  getCurrentPlan(@GetUser() user: Company) {
    return this.userService.getSubscriptionPlan(
      user,
    );
  }

  //change password
  @Patch('changePassword')
  changePass(
    @GetUser() user: Company,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      user,
      dto,
    );
  }

  //edits profile where company can change, Name, Country, and/or Industry
  @Patch('editProfile')
  editProfile(
    @GetUser() user: Company,
    @Body() dto: editProfileDto,
  ) {
    return this.userService.editProfile(
      user,
      dto,
    );
  }

  @Post('subscribe')
  async subscription(
    @GetUser() user: Company,
    @Body() dto: subscriptionDto,
  ) {
    return await this.userService.subscribe(
      user,
      dto,
    );
  }

  @Put('changeSubscriptionPlan')
  async changeSubscription(
    @GetUser() user: Company,
    @Body() dto: subscriptionDto,
  ) {
    return await this.userService.changeSubscriptionPlan(
      user,
      dto,
    );
  }

  @Get('members')
  getAllMembers(@GetUser() user: Company) {
    return this.userService.getMembers(user);
  }

  @Post('members')
  async addMembers(
    @GetUser() user: Company,
    @Body() dto: addMembersDto,
  ) {
    return await this.userService.addMembers(
      user,
      dto,
    );
  }

  @Delete('members:id')
  deleteMembers(@Param() params: any) {}
}
