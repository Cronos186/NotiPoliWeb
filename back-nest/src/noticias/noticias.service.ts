import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Noticia } from './noticia.entity';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectRepository(Noticia)
    private noticiasRepository: Repository<Noticia>,
  ) {}

  findAll(): Promise<Noticia[]> {
    return this.noticiasRepository.find();
  }

  findOne(id: number): Promise<Noticia | null> {
    return this.noticiasRepository.findOneBy({ id });
  }

  create(noticia: Noticia): Promise<Noticia> {
    const nuevaNoticia = this.noticiasRepository.create(noticia);
    return this.noticiasRepository.save(nuevaNoticia);
  }

  async remove(id: number): Promise<void> {
    await this.noticiasRepository.delete(id);
  }
}
