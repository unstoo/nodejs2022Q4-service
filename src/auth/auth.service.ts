import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Auth } from './entities/auth.entity';
import bcrypt from 'bcrypt';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
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
    result: null | string;
  }> {
    const result = await this.userService.findByLoginName(createAuthDto.login);
    if (!result)
      return {
        error: 403,
        result: null,
      };

    const isMatch = bcrypt.compare(createAuthDto.password, result.password);
    if (!isMatch)
      return {
        error: 403,
        result: null,
      };

    const JWT_TOKEN = 'im_token';

    return {
      error: null,
      result: JWT_TOKEN,
    };
  }
}
