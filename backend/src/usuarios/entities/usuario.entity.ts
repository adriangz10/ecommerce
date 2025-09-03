// src/usuarios/entities/usuario.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

export enum Rol {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 100, nullable: false })
  nombre: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @Column({ length: 255, nullable: false, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.CLIENTE,
  })
  rol: Rol;

  @Column('text', { nullable: true })
  direccion: string;

  @CreateDateColumn({ type: 'datetime' })
  fecha_alta: Date;

  @OneToMany(() => Pedido, (pedido) => pedido.usuario)
  pedidos: Pedido[];
}
