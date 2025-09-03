import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    const { email, password } = createUsuarioDto;

    const existingUser = await this.usuarioRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const usuario = this.usuarioRepository.create(createUsuarioDto);

    const salt = await bcrypt.genSalt();
    usuario.password = await bcrypt.hash(password, salt);

    const newUser = await this.usuarioRepository.save(usuario);
    const { password: _, ...result } = newUser;
    return result;
  }

  async findAll(): Promise<Omit<Usuario, 'password'>[]> {
    const users = await this.usuarioRepository.find();
    return users.map(user => {
        const { password, ...result } = user;
        return result;
    });
  }

  async findOne(id: number): Promise<Omit<Usuario, 'password'>> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    const { password, ...result } = usuario;
    return result;
  }

  // Se corrige la firma del método para permitir que devuelva null,
  // ya que la búsqueda de un email puede no encontrar un resultado.
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ 
        where: { email },
        select: ['id_usuario', 'nombre', 'email', 'password', 'rol'] // Asegurarnos de traer el password
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Omit<Usuario, 'password'>> {
    const usuarioToUpdate = await this.usuarioRepository.findOne({ where: { id_usuario: id } });
    if (!usuarioToUpdate) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (updateUsuarioDto.password) {
        const salt = await bcrypt.genSalt();
        updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }

    this.usuarioRepository.merge(usuarioToUpdate, updateUsuarioDto);
    const updatedUser = await this.usuarioRepository.save(usuarioToUpdate);
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }
    return { message: `Usuario con ID ${id} eliminado correctamente.` };
  }
}