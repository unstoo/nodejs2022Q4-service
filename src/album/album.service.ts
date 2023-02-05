import { Injectable } from '@nestjs/common';
import { getUuid } from 'src/utils/getUuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = [];

  create(createAlbumDto: CreateAlbumDto) {
    const album = {
      ...createAlbumDto,
      id: getUuid(),
    };
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album | undefined {
    const album = this.albums.find((album) => album.id === id);
    if (!album) return album;
    Object.assign(album, updateAlbumDto);

    return album;
  }

  remove(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index < 0) return false;
    this.albums.splice(index, 1);
    // trackService.removeAlbum
    // favService.removeAlbum
    return true;
  }
  removeArtist(artistId: string) {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
