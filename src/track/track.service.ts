import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { prisma } from 'src/utils/prismaClient';

const disconnect = async () => {
  await prisma.$disconnect();
};
const handleErr = async (e) => {
  console.error(e);
  await prisma.$disconnect();
};
@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favasService: FavoritesService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    let result;
    try {
      result = await prisma.track.create({
        data: createTrackDto,
      });
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async findAll() {
    let result = [];
    try {
      result = await prisma.track.findMany();
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async findOne(id: string) {
    let result;
    try {
      result = await prisma.track.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findOne(id);
    if (!track) return undefined;

    let result;
    try {
      result = await prisma.track.update({
        where: {
          id,
        },
        data: {
          ...track,
          ...updateTrackDto,
        },
      });
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async remove(id: string) {
    let result = true;
    try {
      await prisma.track.delete({
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
