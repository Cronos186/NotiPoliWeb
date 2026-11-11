import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Favorito } from './favorito.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  fechaRegistro!: string;

  @OneToMany(() => Favorito, favorito => favorito.usuario)
  favoritos!: Favorito[];
}

