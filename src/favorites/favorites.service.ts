import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';

const favs = {
  artists: [],
  albums: [],
  tracks: [],
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

  findAll() {
    return favs;
  }

  addArtist(id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist) return false;
    favs.artists.push(artist);
    return true;
  }
  removeArtist(id: string) {
    const index = favs.artists.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.artists.splice(index, 1);
    return true;
  }

  addAlbum(id: string) {
    const entity = this.albumService.findOne(id);
    if (!entity) return false;
    favs.albums.push(entity);
    return true;
  }
  removeAlbum(id: string) {
    const index = favs.albums.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.albums.splice(index, 1);
    return true;
  }

  addTrack(id: string) {
    const entity = this.trackService.findOne(id);
    if (!entity) return false;
    favs.tracks.push(entity);
    return true;
  }
  removeTrack(id: string) {
    const index = favs.tracks.findIndex((entity) => entity.id === id);
    if (index < 0) return false;
    favs.tracks.splice(index, 1);
    return true;
  }
}
