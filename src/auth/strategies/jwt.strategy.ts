import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Este método é chamado automaticamente pelo Passport após verificar a assinatura do JWT
   * e sua validade (incluindo expiração), usando o secretOrKey.
   * O 'payload' é o objeto que foi usado para criar o token JWT (o que passamos para jwtService.sign()).
   * @param payload O payload decodificado do JWT.
   * @returns O objeto que será anexado a req.user.
   */
  validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
