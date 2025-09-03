// src/pedidos/entities/pedido.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { PedidoDetalle } from './pedido-detalle.entity';

export enum EstadoPedido {
  CARRITO = 'carrito',
  PENDIENTE = 'pendiente',
  PAGADO = 'pagado',
  ENVIADO = 'enviado',
  ENTREGADO = 'entregado',
  CANCELADO = 'cancelado',
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn({ type: 'datetime' })
  fecha_pedido: Date;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.CARRITO,
  })
  estado: EstadoPedido;

  @Column('decimal', { precision: 10, scale: 2, default: 0.00 })
  total: number;

  @Column('text', { nullable: true })
  direccion_envio: string;

  @OneToMany(() => PedidoDetalle, (detalle) => detalle.pedido, { cascade: true })
  detalles: PedidoDetalle[];
}
