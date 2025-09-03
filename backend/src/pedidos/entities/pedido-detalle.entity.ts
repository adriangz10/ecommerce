// src/pedidos/entities/pedido-detalle.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Articulo } from '../../articulos/entities/articulo.entity';

@Entity('pedido_detalles')
@Unique(['pedido', 'articulo'])
export class PedidoDetalle {
  @PrimaryGeneratedColumn()
  id_detalle: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  @ManyToOne(() => Articulo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio_unitario: number;
}
