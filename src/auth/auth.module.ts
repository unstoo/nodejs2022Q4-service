import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
