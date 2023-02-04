export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}

export type UserList = Array<User>;

export interface CreateUserDTO {
  login: string;
  password: string;
}

export interface UpdatePasswordDTO {
  oldPassword: string; // previous password
  newPassword: string; // new password
}
