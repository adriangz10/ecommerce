// src/categorias/entities/categoria.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria: number;

  @Column({ length: 100, unique: true, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  @OneToMany(() => Articulo, (articulo) => articulo.categoria)
  articulos: Articulo[];
}