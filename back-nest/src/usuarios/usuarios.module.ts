import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Favorito } from './favorito.entity';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Favorito])],
  providers: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
