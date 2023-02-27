import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { User, CreateUserDTO, UpdatePasswordDTO } from './user.types';
const nowStamp = () => new Date();
const dateToNumber = (timestamp) => {
  const dateTime = new Date(timestamp);
  return dateTime.getTime();
};

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const disconnect = async () => {
  await prisma.$disconnect();
};
const handleErr = async (e) => {
  console.error(e);
  await prisma.$disconnect();
};

const salt = 10;

const getHashPassword = async (password: string) => {
  return await hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};

@Injectable()
export class UserService {
  async findAll(): Promise<User[]> {
    let result = [];
    try {
      result = await prisma.user.findMany();
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }

    result.map((u) => {
      u.createdAt = dateToNumber(u.createdAt);
      u.updatedAt = dateToNumber(u.updatedAt);
    });

    return result;
  }

  async findOne(id: string): Promise<User> {
    let result;
    try {
      result = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      if (result) {
        result.updatedAt = dateToNumber(result.updatedAt);
        result.createdAt = dateToNumber(result.createdAt);
      }
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async findByLoginName(login: string): Promise<User> {
    let result;
    try {
      result = await prisma.user.findFirst({
        where: {
          login,
        },
      });
      if (result) {
        result.updatedAt = dateToNumber(result.updatedAt);
        result.createdAt = dateToNumber(result.createdAt);
      }
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const user = {
      login: userData.login,
      password: await getHashPassword(userData.password),
      version: 1,
      createdAt: nowStamp(),
      updatedAt: nowStamp(),
    };
    let result;

    try {
      result = await prisma.user.create({
        data: user,
      });
      delete result.password;
      result.createdAt = dateToNumber(result.createdAt);
      result.updatedAt = dateToNumber(result.updatedAt);
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }

    return result;
  }

  async updatePassword(
    id: string,
    data: UpdatePasswordDTO,
  ): Promise<{
    error: 404 | 403 | null;
    user: User;
  }> {
    const user = await this.findOne(id);
    if (!user) return { error: 404, user: null };

    const isMatch = await comparePassword(data.oldPassword, user.password);
    if (!isMatch) return { error: 403, user: null };

    const now = nowStamp();
    const newHash = await getHashPassword(data.newPassword);
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newHash,
        version: user.version + 1,
        updatedAt: now,
      },
    });

    user.password = newHash;
    user.version += 1;
    user.updatedAt = dateToNumber(now);
    user.createdAt = dateToNumber(user.createdAt);

    return {
      user: {
        ...user,
        password: undefined,
      },
      error: null,
    };
  }

  async delete(id: string): Promise<boolean> {
    let result = true;
    try {
      await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      result = false;
    } finally {
      await disconnect();
    }
    return result;
  }
}
