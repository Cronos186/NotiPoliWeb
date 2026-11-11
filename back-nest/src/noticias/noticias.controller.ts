import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { NoticiasService } from './noticias.service';
import { Noticia } from './noticia.entity';

@Controller('noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  @Get()
  findAll(): Promise<Noticia[]> {
    return this.noticiasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Noticia | null> {
    return this.noticiasService.findOne(+id);
  }

  @Post()
  create(@Body() noticia: Noticia): Promise<Noticia> {
    return this.noticiasService.create(noticia);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.noticiasService.remove(+id);
  }
}
