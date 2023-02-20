import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { getUuid } from 'src/utils/getUuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

const albums: Album[] = [];
@Injectable()
export class AlbumService {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favasService: FavoritesService,
  ) {}
  create(createAlbumDto: CreateAlbumDto) {
    const album = {
      ...createAlbumDto,
      id: getUuid(),
    };
    albums.push(album);
    return album;
  }

  findAll() {
    return albums;
  }

  findOne(id: string) {
    return albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album | undefined {
    const album = this.findOne(id);
    if (!album) return album;
    Object.assign(album, updateAlbumDto);

    return album;
  }

  remove(id: string) {
    const index = albums.findIndex((album) => album.id === id);
    if (index < 0) return false;
    albums.splice(index, 1);
    this.trackService.removeAlbum(id);
    this.favasService.removeAlbum(id);
    return true;
  }
  removeArtist(artistId: string) {
    albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
