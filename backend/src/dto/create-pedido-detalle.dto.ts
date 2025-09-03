// src/dto/create-pedido-detalle.dto.ts
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreatePedidoDetalleDto {
  @IsInt()
  @IsNotEmpty()
  articulo_id: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  precio_unitario: number;
}
