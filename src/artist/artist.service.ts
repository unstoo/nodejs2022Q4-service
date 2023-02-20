import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { getUuid } from 'src/utils/getUuid';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

const artists: Artist[] = [];

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allArtists = await prisma.artist.findMany();
  return allArtists;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

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

  create(createArtistDto: CreateArtistDto): Artist {
    const artist = {
      ...createArtistDto,
      id: getUuid(),
    };

    artists.push(artist);
    return artist;
  }

  async findAll(): Promise<Artist[]> {
    // return artists;
    return await main();
  }

  findOne(id: string): Artist {
    return artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist | undefined {
    const artist = this.findOne(id);
    if (!artist) return artist;
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): boolean {
    const index = artists.findIndex((artist) => artist.id === id);
    if (index < 0) return false;
    artists.splice(index, 1);
    this.albumService.removeArtist(id);
    this.trackService.removeArtist(id);
    this.favasService.removeArtist(id);
    return true;
  }
}
