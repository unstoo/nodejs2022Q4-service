import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.favorite.delete({
      where: {
        userId: 1,
      },
    });
  } catch (e) {}
  try {
    await prisma.favorite.create({
      data: {
        userId: 1,
      },
    });
  } catch (e) {}
})();
