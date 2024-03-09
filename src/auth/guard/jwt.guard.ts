import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('myKey') {
  constructor() {
    super();
  }
}
