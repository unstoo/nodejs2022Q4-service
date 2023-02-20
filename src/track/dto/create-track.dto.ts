import { IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;
  @IsUUID()
  @IsOptional()
  artistId: string | null; // refers to Artist
  @IsUUID()
  @IsOptional()
  albumId: string | null; // refers to Album
  @IsInt()
  duration: number; // integer number
}
