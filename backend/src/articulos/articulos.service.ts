// src/articulos/articulos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articulo } from './entities/articulo.entity';
import { CreateArticuloDto } from '../dto/create-articulo.dto';
import { UpdateArticuloDto } from '../dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articulosRepository: Repository<Articulo>,
  ) {}

  async create(createArticuloDto: CreateArticuloDto) {
        const articuloToSave = {
            ...createArticuloDto,
            categoria: { id_categoria: createArticuloDto.categoria_id },
            proveedor: { id_proveedor: createArticuloDto.proveedor_id }
        };
        const newArticulo = await this.articulosRepository.save(articuloToSave);

        return this.articulosRepository.findOne({ 
            where: { id_articulo: newArticulo.id_articulo },
            relations: ['categoria', 'proveedor'] 
        });
    }

  findAll() {
    return this.articulosRepository.find({ relations: ['categoria', 'proveedor'] });
  }

  findOne(id: number) {
    return this.articulosRepository.findOne({ where: { id_articulo: id }, relations: ['categoria', 'proveedor'], });
  }

  async update(id: number, data: any) {
  const articulo = await this.articulosRepository.preload({
    id_articulo: id,
    ...data,
    categoria: data.categoria_id
      ? { id_categoria: data.categoria_id }
      : undefined,
    proveedor: data.proveedor_id
      ? { id_proveedor: data.proveedor_id }
      : undefined,
  });

  if (!articulo) throw new NotFoundException(`Artículo ${id} no encontrado`);

  return this.articulosRepository.save(articulo);
}


  remove(id: number) {
    return this.articulosRepository.delete(id);
  }
}