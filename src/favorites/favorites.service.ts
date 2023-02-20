import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { prisma } from 'src/utils/prismaClient';

const favs = {
  artists: [],
  albums: [],
  tracks: [],
};

const disconnect = async () => {
  await prisma.$disconnect();
};
const handleErr = async (e) => {
  console.error(e);
  await prisma.$disconnect();
};

@Injectable()
export class FavoritesService {
  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  async findAll() {
    let result = [];
    try {
      result = await prisma.favorite.findMany();
    } catch (e) {
      await handleErr(e);
    } finally {
      await disconnect();
    }
    return result;
  }

  async addArtist(id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) return false;

    const exists = await prisma.favorite.create({ data: {} });
    if (!exists) return false;

    return true;
  }
  async removeArtist(id: string) {
    const index = favs.artists.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.artists.splice(index, 1);
    return true;
  }

  async addAlbum(id: string) {
    const entity = await this.albumService.findOne(id);
    if (!entity) return false;
    favs.albums.push(entity);
    return true;
  }
  async removeAlbum(id: string) {
    const index = favs.albums.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.albums.splice(index, 1);
    return true;
  }

  async addTrack(id: string) {
    const entity = await this.trackService.findOne(id);
    if (!entity) return false;
    favs.tracks.push(entity);
    return true;
  }
  async removeTrack(id: string) {
    const index = favs.tracks.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.tracks.splice(index, 1);
    return true;
  }
}
