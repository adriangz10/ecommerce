// src/articulos/dto/create-articulo.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticuloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  categoria_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  precio_unitario: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock_actual: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock_minimo: number;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  unidad_medida?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  proveedor_id?: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  imagen_url?: string;
}