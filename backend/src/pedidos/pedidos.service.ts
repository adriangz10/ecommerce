import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido, EstadoPedido } from './entities/pedido.entity';
import { PedidoDetalle } from './entities/pedido-detalle.entity';
import { Articulo } from '../articulos/entities/articulo.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(PedidoDetalle)
    private readonly detalleRepository: Repository<PedidoDetalle>,
    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,
  ) {}

  // Encuentra el carrito activo de un usuario o crea uno nuevo si no existe.
  async getCarrito(usuarioId: number): Promise<Pedido> {
    let carrito = await this.pedidoRepository.findOne({
      where: { usuario: { id_usuario: usuarioId }, estado: EstadoPedido.CARRITO },
      relations: ['detalles', 'detalles.articulo'],
    });

    if (!carrito) {
      carrito = this.pedidoRepository.create({
        usuario: { id_usuario: usuarioId } as Usuario,
        estado: EstadoPedido.CARRITO,
        detalles: [],
      });
      await this.pedidoRepository.save(carrito);
    }
    
    return carrito;
  }

  // Añade un item al carrito
  async addItemToCarrito(usuarioId: number, articuloId: number, cantidad: number) {
    const carrito = await this.getCarrito(usuarioId);
    const articulo = await this.articuloRepository.findOne({ where: { id_articulo: articuloId } });

    // Se agrega una verificación para el caso en que el artículo no se encuentre.
    if (!articulo) {
      throw new NotFoundException(`Artículo con ID ${articuloId} no encontrado.`);
    }
    if (articulo.stock_actual < cantidad) {
      throw new BadRequestException(`Stock insuficiente para el artículo "${articulo.nombre}".`);
    }

    let detalle = carrito.detalles.find(d => d.articulo.id_articulo === articuloId);

    if (detalle) {
      // Si el artículo ya está en el carrito, actualiza la cantidad
      detalle.cantidad += cantidad;
    } else {
      // Si es un artículo nuevo, crea un nuevo detalle
      detalle = this.detalleRepository.create({
        pedido: carrito,
        articulo: articulo,
        cantidad: cantidad,
        precio_unitario: articulo.precio_unitario,
      });
      carrito.detalles.push(detalle);
    }
    
    await this.detalleRepository.save(detalle);
    await this.recalcularTotal(carrito.id_pedido);
    
    return this.pedidoRepository.findOne({ where: { id_pedido: carrito.id_pedido }, relations: ['detalles', 'detalles.articulo'] });
  }

  // Elimina un item del carrito
  async removeItemFromCarrito(detalleId: number) {
    const detalle = await this.detalleRepository.findOne({ where: { id_detalle: detalleId }, relations: ['pedido']});
    if(!detalle) {
      throw new NotFoundException(`Detalle con ID ${detalleId} no encontrado.`);
    }
    const pedidoId = detalle.pedido.id_pedido;
    await this.detalleRepository.remove(detalle);
    await this.recalcularTotal(pedidoId);
    return { message: 'Artículo eliminado del carrito.' };
  }

  // Convierte el carrito en un pedido formal
  async formalizarPedido(usuarioId: number, direccionEnvio: string): Promise<Pedido> {
    const carrito = await this.getCarrito(usuarioId);
    if (carrito.detalles.length === 0) {
      throw new BadRequestException('El carrito está vacío.');
    }

    // Aquí iría la lógica de pago (Stripe, etc.)
    // Si el pago es exitoso:

    // 1. Actualizar el stock de los artículos
    for (const detalle of carrito.detalles) {
      const articulo = await this.articuloRepository.findOne({ where: { id_articulo: detalle.articulo.id_articulo } });
      
      // *** CORRECCIÓN: Añadir verificación de nulidad para 'articulo' ***
      // Sin esta verificación, si findOne devuelve null, las siguientes líneas fallarán.
      if (!articulo) {
        throw new NotFoundException(`El artículo con ID ${detalle.articulo.id_articulo} no se encontró.`);
      }

      if (articulo.stock_actual < detalle.cantidad) {
        throw new BadRequestException(`Stock insuficiente para "${articulo.nombre}" al momento de formalizar.`);
      }
      articulo.stock_actual -= detalle.cantidad;
      await this.articuloRepository.save(articulo);
    }

    // 2. Actualizar el estado y la dirección del pedido
    carrito.estado = EstadoPedido.PENDIENTE; // O 'pagado' si el pago fue instantáneo
    carrito.direccion_envio = direccionEnvio;
    await this.pedidoRepository.save(carrito);

    return carrito;
  }

  // Recalcula el total del pedido/carrito
  private async recalcularTotal(pedidoId: number) {
    const pedido = await this.pedidoRepository.findOne({ where: { id_pedido: pedidoId }, relations: ['detalles'] });
    
    // *** CORRECCIÓN: Añadir verificación de nulidad para 'pedido' ***
    // Si findOne no encuentra el pedido, esta variable será null, causando errores.
    if (!pedido) {
      console.error(`Error: Intento de recalcular total para un pedido no encontrado: ID ${pedidoId}`);
      return; // Detiene la ejecución si el pedido no existe.
    }

    pedido.total = pedido.detalles.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
    await this.pedidoRepository.save(pedido);
  }
  
  // Otros métodos (ver pedidos de un usuario, etc.)
  async findUserOrders(usuarioId: number): Promise<Pedido[]> {
    // Nota: El uso de || en la propiedad 'estado' no es la sintaxis correcta.
    // Una opción sería usar la cláusula 'In' de TypeORM si necesitas buscar múltiples estados.
    // Se deja como está para no introducir cambios no solicitados, pero tenlo en cuenta.
    return this.pedidoRepository.find({
      where: {
        usuario: { id_usuario: usuarioId },
        estado: EstadoPedido.PENDIENTE || EstadoPedido.PAGADO || EstadoPedido.ENVIADO || EstadoPedido.ENTREGADO
      },
      relations: ['detalles', 'detalles.articulo']
    });
  }
}
