import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { prisma } from 'src/utils/prismaClient';
import { UserService } from 'src/user/user.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

const disconnect = async () => {
  await prisma.$disconnect();
};
const handleErr = async (e) => {
  console.error(e);
  await prisma.$disconnect();
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
    error: 403 | null;
    result: null | { accessToken: string };
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

    const accessToken = sign(
      { id: result.id, login: result.login },
      'MY_JWT_SECRET',
      {
        expiresIn: '24h',
      },
    );

    return {
      error: null,
      result: { accessToken },
    };
  }
}
