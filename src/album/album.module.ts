import { Module, forwardRef } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistModule } from 'src/artist/artist.module';
import { ArtistService } from 'src/artist/artist.service';

@Module({
  imports: [],
  controllers: [AlbumController],
  providers: [AlbumService, TrackService, FavoritesService, ArtistService],
})
export class AlbumModule {}
