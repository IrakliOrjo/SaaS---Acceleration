import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { LoginGuard } from './guard/login.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log('hey');
    return this.authService.signup(dto);
  }
  @UseGuards(LoginGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('verify/:token')
  verifyMail(@Param() params: any) {
    return this.authService.verifyAccount(
      params.token,
    );
  }
}
