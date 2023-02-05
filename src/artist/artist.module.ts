import { Module, forwardRef } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumModule } from 'src/album/album.module';
import { AlbumService } from 'src/album/album.service';
import { TrackModule } from 'src/track/track.module';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [],
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService, FavoritesService],
})
export class ArtistModule {}
