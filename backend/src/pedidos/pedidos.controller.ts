import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // --- CARRITO ---

  @Get('carrito')
  getCarrito(@Request() req) {
    const usuarioId = req.user.id_usuario;
    return this.pedidosService.getCarrito(usuarioId);
  }

  @Post('carrito/add')
  addItemToCarrito(@Request() req, @Body() body: { articuloId: number, cantidad: number }) {
    const usuarioId = req.user.id_usuario;
    const { articuloId, cantidad } = body;
    return this.pedidosService.addItemToCarrito(usuarioId, articuloId, cantidad);
  }

  @Delete('carrito/item/:detalleId')
  removeItemFromCarrito(@Param('detalleId', ParseIntPipe) detalleId: number) {
    return this.pedidosService.removeItemFromCarrito(detalleId);
  }

  // --- PEDIDOS ---

  @Post('pedidos/formalizar')
  formalizarPedido(@Request() req, @Body() body: { direccionEnvio: string }) {
    const usuarioId = req.user.id_usuario;
    return this.pedidosService.formalizarPedido(usuarioId, body.direccionEnvio);
  }

  @Get('pedidos')
  findUserOrders(@Request() req) {
      const usuarioId = req.user.id_usuario;
      return this.pedidosService.findUserOrders(usuarioId);
  }
}
