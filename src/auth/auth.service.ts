import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { compare } from 'bcrypt';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';

const makeTokens = (id, login) => {
  const accessToken = sign({ id, login }, process.env.MY_JWT_SECRET, {
    expiresIn: '24h',
  });
  const refreshToken = sign({ id, login }, process.env.MY_JWT_SECRET, {
    expiresIn: '14d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async signup(createAuthDto: CreateAuthDto): Promise<Auth> {
    const result = await this.userService.create(createAuthDto);
    return result;
  }
  async login(createAuthDto: CreateAuthDto): Promise<{
    error: 403 | 500 | null;
    result: null | { accessToken: string; refreshToken: string };
  }> {
    const result = await this.userService.findByLoginName(createAuthDto.login);
    if (!result)
      return {
        error: 403,
        result: null,
      };

    const isMatch = compare(createAuthDto.password, result.password);
    if (!isMatch)
      return {
        error: 403,
        result: null,
      };

    let tokens;

    try {
      tokens = makeTokens(result.id, result.login);
    } catch (e) {
      return {
        error: 500,
        result: null,
      };
    }

    return {
      error: null,
      result: tokens,
    };
  }
  async refresh(refreshToken: string): Promise<{
    error: 403 | 500 | null;
    result: null | { accessToken: string; refreshToken: string };
  }> {
    let verified;
    try {
      verified = verify(refreshToken, process.env.MY_JWT_SECRET);
      const now = Date.now();
      const expire = Number(verified.exp) * 1000;
      if (now > expire)
        return {
          error: 403,
          result: null,
        };

      return {
        error: null,
        result: makeTokens(verified.id, verified.login),
      };
    } catch (e) {
      return {
        error: 403,
        result: null,
      };
    }
  }
}
