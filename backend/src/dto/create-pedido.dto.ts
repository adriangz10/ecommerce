// src/dto/create-pedido.dto.ts
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreatePedidoDetalleDto } from './create-pedido-detalle.dto';

export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty()
  usuario_id: number;

  @IsString()
  @IsOptional()
  direccion_envio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoDetalleDto)
  detalles: CreatePedidoDetalleDto[];
}
