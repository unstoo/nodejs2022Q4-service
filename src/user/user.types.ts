import { IsString } from 'class-validator';
export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export type UserList = Array<User>;

export class CreateUserDTO {
  @IsString()
  login: string;
  @IsString()
  password: string;
}

export class UpdatePasswordDTO {
  @IsString()
  oldPassword: string; // previous password
  @IsString()
  newPassword: string; // new password
}
