import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from 'src/track/track.module';
import { TrackService } from 'src/track/track.service';

@Module({
  imports: [TrackModule],
  controllers: [AlbumController],
  providers: [AlbumService, TrackService],
})
export class AlbumModule {}
