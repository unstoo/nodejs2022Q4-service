import {
  Controller,
  Post,
  HttpCode,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

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
}
