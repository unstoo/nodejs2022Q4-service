import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { getUuid } from 'src/utils/getUuid';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    const artist = {
      ...createArtistDto,
      id: getUuid(),
    };

    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    return this.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist | undefined {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) return artist;

    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): boolean {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index < 0) return false;

    this.artists.splice(index, 1);
    return true;
  }
}
