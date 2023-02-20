import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    const isAdded = this.favoritesService.addTrack(id);
    if (!isAdded)
      throw new HttpException('Not added', HttpStatus.UNPROCESSABLE_ENTITY);
  }
  @Delete('/track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    const isDeleted = this.favoritesService.removeTrack(id);
    if (!isDeleted)
      throw new HttpException('Not deleted', HttpStatus.NOT_FOUND);
  }

  @Post('/album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const isAdded = this.favoritesService.addAlbum(id);
    if (!isAdded)
      throw new HttpException('Not added', HttpStatus.UNPROCESSABLE_ENTITY);
  }
  @Delete('/album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    const isDeleted = this.favoritesService.removeAlbum(id);
    if (!isDeleted)
      throw new HttpException('Not deleted', HttpStatus.NOT_FOUND);
  }

  @Post('/artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    const isAdded = this.favoritesService.addArtist(id);
    if (!isAdded)
      throw new HttpException('Not added', HttpStatus.UNPROCESSABLE_ENTITY);
  }
  @Delete('/artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    const isDeleted = this.favoritesService.removeArtist(id);
    if (!isDeleted)
      throw new HttpException('Not deleted', HttpStatus.NOT_FOUND);
  }
}
