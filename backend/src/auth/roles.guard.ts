// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Rol } from '../usuarios/entities/usuario.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Rol[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // Si no se especifican roles, se permite el acceso por defecto.
      // La protección principal la da JwtAuthGuard.
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // El usuario debe tener al menos uno de los roles requeridos.
    return requiredRoles.some((role) => user.rol?.includes(role));
  }
}
