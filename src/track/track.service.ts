import { Injectable } from '@nestjs/common';
import { getUuid } from 'src/utils/getUuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto) {
    const track = {
      ...createTrackDto,
      id: getUuid(),
    };
    this.tracks.push(track);
    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    return this.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    if (!track) return track;

    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string) {
    const index = this.tracks.findIndex((album) => album.id === id);
    if (index < 0) return false;
    this.tracks.splice(index, 1);
    // trackService.removeAlbum
    // favService.removeAlbum
    return true;
  }

  removeArtist(artistId: string) {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }
  removeAlbum(albumId: string) {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
