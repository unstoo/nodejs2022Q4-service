import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Module({
  imports: [],
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService, FavoritesService],
})
export class ArtistModule {}
