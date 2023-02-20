import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const disconnect = async () => {
  await prisma.$disconnect();
};
const handleErr = async (e) => {
  console.error(e);
  await prisma.$disconnect();
};
@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favasService: FavoritesService,
  ) {}
  async create(createAlbumDto: CreateAlbumDto) {
    let result;
    try {
      result = await prisma.album.create({
        data: createAlbumDto,
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
      result = await prisma.album.findMany();
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
      result = await prisma.album.findUnique({
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

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    console.log('UPDATE');
    console.log(album);

    if (!album) return undefined;

    let result;
    try {
      result = await prisma.album.update({
        where: {
          id,
        },
        data: {
          ...album,
          ...updateAlbumDto,
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
      await prisma.album.delete({
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

  // removeArtist(artistId: string) {
  //   albums.forEach((album) => {
  //     if (album.artistId === artistId) {
  //       album.artistId = null;
  //     }
  //   });
  // }
}
