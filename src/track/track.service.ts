import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FavoritesService } from 'src/favorites/favorites.service';
import { getUuid } from 'src/utils/getUuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

const tracks: Track[] = [];
@Injectable()
export class TrackService {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favasService: FavoritesService,
  ) {}
  create(createTrackDto: CreateTrackDto) {
    const track = {
      ...createTrackDto,
      id: getUuid(),
    };
    tracks.push(track);
    return track;
  }

  findAll() {
    return tracks;
  }

  findOne(id: string) {
    return tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    if (!track) return track;

    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string) {
    const index = tracks.findIndex((album) => album.id === id);
    if (index < 0) return false;
    tracks.splice(index, 1);
    this.favasService.removeTrack(id);
    return true;
  }

  removeArtist(artistId: string) {
    console.log(artistId);
    console.log(tracks);
    tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }
  removeAlbum(albumId: string) {
    tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
