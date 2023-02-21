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
const empty = {
  albums: [],
  tracks: [],
  artists: [],
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
    let result = empty;
    try {
      result = await prisma.favorite.findUnique({
        where: {
          userId: 1,
        },
        include: {
          artists: true,
          albums: true,
          tracks: true,
        },
      });
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

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        artists: {
          connect: [{ id: artist.id }],
        },
      },
    });
    return true;
  }
  async removeArtist(artistId: string) {
    const res = await prisma.favorite.findUnique({
      where: {
        userId: 1,
      },
      include: {
        artists: true,
      },
    });

    const artist = res.artists.find((artist) => artist.id === artistId);
    if (!artist) return false;

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        artists: {
          disconnect: [{ id: artistId }],
        },
      },
    });
    return true;
  }

  async addAlbum(id: string) {
    const entity = await this.albumService.findOne(id);
    if (!entity) return false;

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        albums: {
          connect: [{ id: entity.id }],
        },
      },
    });
    return true;
  }
  async removeAlbum(albumId: string) {
    const res = await prisma.favorite.findUnique({
      where: {
        userId: 1,
      },
      include: {
        albums: true,
      },
    });
    const album = res.albums.find((album) => album.id === albumId);
    if (!album) return false;

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        albums: {
          disconnect: [{ id: albumId }],
        },
      },
    });
    return true;
  }

  async addTrack(id: string) {
    const entity = await this.trackService.findOne(id);

    if (!entity) return false;

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        tracks: {
          connect: [{ id: entity.id }],
        },
      },
    });
    return true;
  }
  async removeTrack(trackId: string) {
    const res = await prisma.favorite.findUnique({
      where: {
        userId: 1,
      },
      include: {
        tracks: true,
      },
    });
    const track = res.tracks.find((track) => track.id === trackId);
    if (!track) return false;

    await prisma.favorite.update({
      where: {
        userId: 1,
      },
      data: {
        tracks: {
          disconnect: [{ id: trackId }],
        },
      },
    });
    return true;
  }
}
