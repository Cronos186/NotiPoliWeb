import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email: string): Promise<Usuario | null> {
    return this.usuariosService.findOneByEmail(email);
  }

  @Post()
  create(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuariosService.create(usuario);
  }

  @Get(':email/favoritos')
  getFavoritos(@Param('email') email: string): Promise<number[]> {
    return this.usuariosService.getFavoritos(email);
  }

  @Post(':email/favoritos/:noticiaId')
  addFavorito(@Param('email') email: string, @Param('noticiaId') noticiaId: string) {
    return this.usuariosService.addFavorito(email, +noticiaId);
  }

  @Delete(':email/favoritos/:noticiaId')
  removeFavorito(@Param('email') email: string, @Param('noticiaId') noticiaId: string) {
    return this.usuariosService.removeFavorito(email, +noticiaId);
  }
}
