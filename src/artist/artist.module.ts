import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumModule } from 'src/album/album.module';
import { AlbumService } from 'src/album/album.service';
import { TrackModule } from 'src/track/track.module';
import { TrackService } from 'src/track/track.service';

@Module({
  imports: [AlbumModule, TrackModule],
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService, TrackService],
})
export class ArtistModule {}
