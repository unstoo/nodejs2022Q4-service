import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumModule } from 'src/album/album.module';
import { AlbumService } from 'src/album/album.service';

@Module({
  imports: [AlbumModule],
  controllers: [ArtistController],
  providers: [ArtistService, AlbumService],
})
export class ArtistModule {}
