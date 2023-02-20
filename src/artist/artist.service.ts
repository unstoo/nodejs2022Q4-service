import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { getUuid } from 'src/utils/getUuid';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
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
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favasService: FavoritesService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    let result;
    try {
      result = await prisma.artist.create({
        data: createArtistDto,
      });
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async findAll(): Promise<Artist[]> {
    let result = [];
    try {
      result = await prisma.artist.findMany();
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async findOne(id: string): Promise<Artist> {
    let result;
    try {
      result = await prisma.artist.findUnique({
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

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    if (!artist) return undefined;

    let result;
    try {
      result = await prisma.artist.update({
        where: {
          id,
        },
        data: {
          ...artist,
          ...updateArtistDto,
        },
      });
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async remove(id: string): Promise<boolean> {
    let result = true;
    try {
      await prisma.artist.delete({
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
    // const index = artists.findIndex((artist) => artist.id === id);
    // if (index < 0) return false;
    // artists.splice(index, 1);
    // this.albumService.removeArtist(id);
    // this.trackService.removeArtist(id);
    // this.favasService.removeArtist(id);
    // return true;
  }
}
