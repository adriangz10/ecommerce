import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedoreDto } from '../dto/create-proveedore.dto';
import { UpdateProveedoreDto } from '../dto/update-proveedore.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedoreDto) {
    const proveedor = this.proveedorRepository.create(createProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async findAll() {
    return await this.proveedorRepository.find();
  }

  async findOne(id: number) {
    const proveedor = await this.proveedorRepository.findOne({ where: { id_proveedor: id } });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado.`);
    }
    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedoreDto) {
    const proveedor = await this.findOne(id);
    this.proveedorRepository.merge(proveedor, updateProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: number) {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
    return { message: `Proveedor con ID ${id} eliminado correctamente.` };
  }
}