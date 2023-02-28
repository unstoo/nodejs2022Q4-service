import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';

const hasExpired = (stamp) => {
  const now = Date.now();
  return now > stamp * 1000;
};

const validateRequest = (req) => {
  let verified;
  try {
    const [label, maybeToken] = req.headers.authorization.split(' ');
    if (label !== 'Bearer') throw new Error();
    verified = verify(maybeToken, process.env.MY_JWT_SECRET);
    console.log(verified);
    if (hasExpired(verified.exp)) throw new Error();
  } catch (e) {
    throw new UnauthorizedException('Wrong access token');
  }
  return true;
};

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
