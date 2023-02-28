import {
  Controller,
  Post,
  HttpCode,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(201)
  async signup(@Body() createAuthDto: CreateAuthDto) {
    const res = await this.authService.signup(createAuthDto);
    return res;
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() createAuthDto: CreateAuthDto) {
    const { result, error } = await this.authService.login(createAuthDto);
    if (error)
      throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);

    return result;
  }

  @Post('/refresh')
  @HttpCode(200)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Headers() headers) {
    if (!refreshTokenDto.refreshToken)
      throw new HttpException('No refresh token', HttpStatus.UNAUTHORIZED);

    let refreshedTokens;
    try {
      const [label, maybeToken] = headers.authorization.split(' ');
      if (label !== 'Bearer') throw Error();
      const { result, error } = await this.authService.refresh(maybeToken);
      if (error) throw Error();

      refreshedTokens = result;
    } catch (e) {
      throw new HttpException('Wrong refresh token', HttpStatus.FORBIDDEN);
    }

    return refreshedTokens;
  }
}
