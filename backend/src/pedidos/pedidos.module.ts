// src/pedidos/pedidos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Articulo } from '../articulos/entities/articulo.entity'; // Importante para la lógica del servicio

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, PedidoDetalle, Articulo])],
  providers: [PedidosService],
  controllers: [PedidosController],
})
export class PedidosModule {}
