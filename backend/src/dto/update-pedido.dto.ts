// src/dto/update-pedido.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPedido } from '../pedidos/entities/pedido.entity';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
    @IsEnum(EstadoPedido)
    @IsOptional()
    estado?: EstadoPedido;
}
