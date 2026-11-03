import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Noticia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column()
  categoria!: string;

  @Column()
  imagen!: string;

  @Column()
  descripcion!: string;

  @Column('text')
  contenido!: string;

  @Column()
  fecha!: string;

  @Column()
  autorEmail!: string;

  @Column()
  autorNombre!: string;
}

