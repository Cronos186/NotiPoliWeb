import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Noticia } from './noticia.entity';
import { NoticiasService } from './noticias.service';
import { NoticiasController } from './noticias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Noticia])],
  providers: [NoticiasService],
  controllers: [NoticiasController],
})
export class NoticiasModule {}
