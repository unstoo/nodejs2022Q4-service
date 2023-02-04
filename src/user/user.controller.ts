import * as uuid from 'uuid';
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
} from '@nestjs/common';

import { User, UserList, CreateUserDTO, UpdatePasswordDTO } from './user.types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}
  @Get()
  findAll(): UserList {
    // GET / user - get all users
    // Server should answer with status code 200 and all users records
    return this.service.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string): User {
    // GET / user /: id - get single user by id
    // Server should answer with status code 400 and corresponding message if userId is invalid(not uuid)
    if (!uuid.validate(id))
      throw new HttpException('Invald uuid', HttpStatus.BAD_REQUEST);
    const user = this.service.findOne(id);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (!user) throw new HttpException('Invald uuid', HttpStatus.NOT_FOUND);
    // Server should answer with status code 200 and and record with id === userId if it exists
    return user;
  }
  @Post('/')
  create(@Body() userData: CreateUserDTO): Omit<User, 'password'> {
    // POST / user - create user(following DTO should be used) CreateUserDto
    // Server should answer with status code 400 and corresponding message if request body does not contain required fields
    const newUser = this.service.create(userData);

    // Server should answer with status code 201 and newly created record if request is valid
    // 5. User's password should be excluded from server response.
    delete newUser.password;
    return newUser;
  }
  @Put('/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() data: UpdatePasswordDTO,
  ): User {
    // PUT / user /: id - update user's password UpdatePasswordDto (with attributes):
    // Server should answer with status code 400 and corresponding message if userId is invalid(not uuid)
    if (!uuid.validate(id))
      throw new HttpException('Invald uuid', HttpStatus.BAD_REQUEST);

    const { error, user } = this.service.updatePassword(id, data);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (error === 404)
      throw new HttpException('Invald uuid', HttpStatus.NOT_FOUND);
    // Server should answer with status code 403 and corresponding message if oldPassword is wrong
    if (error === 403)
      throw new HttpException('Invald uuid', HttpStatus.FORBIDDEN);

    // Server should answer with status code 200 and updated record if request is valid
    // 5. User's password should be excluded from server response.
    delete user.password;
    return user;
  }

  @Delete(':/id')
  @HttpCode(204) // Server should answer with status code 204 if the record is found and deleted
  deleteUser(@Param('id') id: string) {
    // DELETE / user /: id - delete user
    // Server should answer with status code 400 and corresponding message if userId is invalid(not uuid)
    if (!uuid.validate(id))
      throw new HttpException('Invald uuid', HttpStatus.BAD_REQUEST);
    const isDeleted = this.service.delete(id);
    // Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    if (isDeleted === false)
      throw new HttpException('Invald uuid', HttpStatus.NO_CONTENT);
  }
}
