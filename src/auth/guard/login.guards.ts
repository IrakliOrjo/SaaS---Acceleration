import { AuthGuard } from '@nestjs/passport';

export class LoginGuard extends AuthGuard(
  'login',
) {
  constructor() {
    super();
  }
}
