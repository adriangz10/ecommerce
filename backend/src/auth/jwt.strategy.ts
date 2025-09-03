// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  // Passport verifica la firma del JWT y llama a este método
  // con el payload decodificado.
  async validate(payload: any) {
    // El payload es lo que pusimos al firmar el token en auth.service
    // { email: user.email, sub: user.id_usuario, rol: user.rol }
    // Este objeto será lo que se asigne a `req.user`
    return { id_usuario: payload.sub, email: payload.email, rol: payload.rol };
  }
}
