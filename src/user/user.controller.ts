import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { User, UserList, CreateUserDTO, UpdatePasswordDTO } from './user.types';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private service: UserService) {}
  @Get()
  async findAll(): Promise<UserList> {
    // GET / user - get all users
    // Server should answer with status code 200 and all users records
    return await this.service.findAll();
  }
  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    // GET / user /: id - get single user by id
    // Server should answer with status code 400 and corresponding message if userId is invalid(not uuid)
    const user = await this.service.findOne(id);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    // Server should answer with status code 200 and and record with id === userId if it exists
    return user;
  }
  @Post('/')
  async create(
    @Body() userData: CreateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    // POST / user - create user(following DTO should be used) CreateUserDto
    // Server should answer with status code 400 and corresponding message if request body does not contain required fields
    // Server should answer with status code 201 and newly created record if request is valid
    // 5. User's password should be excluded from server response.
    return await this.service.create(userData);
  }
  @Put('/:id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdatePasswordDTO,
  ): Promise<User> {
    // PUT / user /: id - update user's password UpdatePasswordDto (with attributes):
    // Server should answer with status code 400 and corresponding message if userId is invalid(not uuid)

    const { error, user } = await this.service.updatePassword(id, data);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (error === 404)
      throw new HttpException('Invald uuid', HttpStatus.NOT_FOUND);
    // Server should answer with status code 403 and corresponding message if oldPassword is wrong
    if (error === 403)
      throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);

    // Server should answer with status code 200 and updated record if request is valid
    // 5. User's password should be excluded from server response.
    return user;
  }

  @Delete('/:id')
  @HttpCode(204) // Server should answer with status code 204 if the record is found and deleted
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    const isDeleted = await this.service.delete(id);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (isDeleted === false)
      throw new HttpException('Invald uuid', HttpStatus.NOT_FOUND);
  }
}
