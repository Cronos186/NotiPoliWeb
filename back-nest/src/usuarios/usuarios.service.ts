import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Favorito } from './favorito.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Favorito)
    private favoritosRepository: Repository<Favorito>,
  ) {}

  findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find();
  }

  findOneByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOneBy({ email });
  }

  create(usuario: Usuario): Promise<Usuario> {
    const nuevo = this.usuariosRepository.create(usuario);
    return this.usuariosRepository.save(nuevo);
  }

  async getFavoritos(email: string): Promise<number[]> {
    const usuario = await this.usuariosRepository.findOne({ where: { email }, relations: ['favoritos', 'favoritos.noticia'] });
    if (!usuario) return [];
    return usuario.favoritos.map(f => f.noticia.id);
  }

  async addFavorito(email: string, noticiaId: number): Promise<void> {
    const usuario = await this.usuariosRepository.findOneBy({ email });
    if (!usuario) return;
    const favorito = this.favoritosRepository.create({ usuario, noticia: { id: noticiaId } as any });
    await this.favoritosRepository.save(favorito);
  }

  async removeFavorito(email: string, noticiaId: number): Promise<void> {
    await this.favoritosRepository.delete({ usuario: { id: (await this.usuariosRepository.findOneBy({ email }))?.id }, noticia: { id: noticiaId } as any });
  }
}
