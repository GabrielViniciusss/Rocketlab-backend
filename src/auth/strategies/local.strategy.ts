/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Este método é chamado automaticamente pelo Passport quando a estratégia local é usada.
   * Ele recebe o 'username' (que configuramos para ser o 'email') e a 'password' do corpo da requisição.
   * @param email O email extraído do corpo da requisição.
   * @param password A senha extraída do corpo da requisição.
   * @returns O objeto do usuário se a autenticação for bem-sucedida.
   * @throws UnauthorizedException se a autenticação falhar.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password); // Chama nosso método de validação
    if (!user) {
      // Se authService.validateUser retornar null, significa que o usuário não é válido
      throw new UnauthorizedException('Invalid credentials'); // Lança uma exceção 401
    }
    return user; // Se o usuário for válido, ele é retornado e anexado a req.user pelo Passport
  }
}
