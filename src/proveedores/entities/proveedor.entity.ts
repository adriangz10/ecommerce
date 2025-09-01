// src/proveedores/entities/proveedor.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 100, nullable: true })
  contacto: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'tinyint', default: 1 })
  estado: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_alta: Date;

  @OneToMany(() => Articulo, (articulo) => articulo.proveedor)
  articulos: Articulo[];
}