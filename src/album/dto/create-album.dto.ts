import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;
  @IsNumber()
  year: number;
  @IsUUID()
  @IsOptional()
  artistId: string | null; // refers to Artist
}
