import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [],
  controllers: [TrackController],
  providers: [TrackService, FavoritesService, AlbumService, ArtistService],
})
export class TrackModule {}
