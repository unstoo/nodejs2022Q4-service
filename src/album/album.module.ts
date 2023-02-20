import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [],
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, FavoritesService, ArtistService],
})
export class AlbumModule {}
