/* import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(
  Strategy,
  'login',
) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<any> {
    const user =
      await this.authService.validateAccount(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (!user.verified) {
      throw new UnauthorizedException(
        'Account not activated',
      );
    }

    return user;
  }
}
 */
