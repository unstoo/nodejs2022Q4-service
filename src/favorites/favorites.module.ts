import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Module({
  imports: [],
  controllers: [FavoritesController],
  providers: [FavoritesService, AlbumService, TrackService, ArtistService],
})
export class FavoritesModule {}
