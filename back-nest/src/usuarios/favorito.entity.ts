import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Noticia } from '../noticias/noticia.entity';

@Entity()
export class Favorito {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, usuario => usuario.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario!: Usuario;

  @ManyToOne(() => Noticia, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'noticiaId' })
  noticia!: Noticia;
}

