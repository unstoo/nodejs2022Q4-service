import * as uuid from 'uuid';
import { Injectable } from '@nestjs/common';
import { User, UserList, CreateUserDTO, UpdatePasswordDTO } from './user.types';
const nowStamp = () => Date.now();
const usersStore: User[] = [
  {
    id: '0',
    login: 'admin',
    password: 'admin123',
    version: 0,
    createdAt: nowStamp(),
    updatedAt: nowStamp(),
  },
];

const findUser = (id) => usersStore.find((u) => u.id === id);
const deleteUser = (id) => {
  const index = usersStore.findIndex((u) => u.id === id);
  if (index < 0) return false;
  usersStore.splice(index, 1);
  return true;
};

@Injectable()
export class UserService {
  private readonly users: UserList = usersStore;

  findAll(): User[] {
    return this.users;
  }
  findOne(id: string): User {
    return findUser(id);
  }

  create(userData: CreateUserDTO): User {
    const user: User = {
      id: uuid.v4(),
      ...userData,
      version: 0,
      createdAt: nowStamp(),
      updatedAt: nowStamp(),
    };
    this.users.push(user);
    return user;
  }

  updatePassword(
    id: string,
    data: UpdatePasswordDTO,
  ): {
    error: 404 | 403 | null;
    user: User;
  } {
    const user = this.findOne(id);
    if (!user) return { error: 404, user: null };
    if (data.oldPassword === user.password) return { error: 403, user: null };
    user.password = data.newPassword;
    user.version += 1;
    user.updatedAt = nowStamp();
    return {
      user,
      error: null,
    };
  }

  delete(id: string): boolean {
    return deleteUser(id);
  }
}
