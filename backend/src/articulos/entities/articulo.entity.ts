// src/articulos/entities/articulo.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';

@Entity('articulos')
export class Articulo {
  @PrimaryGeneratedColumn()
  id_articulo: number;

  @Column({ length: 50, unique: true, nullable: false })
  codigo: string;

  @Column({ length: 150, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.articulos, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column('decimal', { precision: 10, scale: 2, default: 0.00 })
  precio_unitario: number;

  @Column({ type: 'int', default: 0 })
  stock_actual: number;

  @Column({ type: 'int', default: 0 })
  stock_minimo: number;

  @Column({ length: 20, default: 'unidad' })
  unidad_medida: string;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.articulos, { eager: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @Column({ length: 255, nullable: true })
  imagen_url: string;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_alta: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_actualizacion: Date;
}