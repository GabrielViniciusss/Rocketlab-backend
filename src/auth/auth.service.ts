/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida se as credenciais do usuário (email e senha) são corretas.
   * Este método será usado pela LocalStrategy.
   * @param email O email fornecido pelo usuário.
   * @param pass A senha em texto plano fornecida pelo usuário.
   * @returns O objeto do usuário (sem a senha) se a validação for bem-sucedida, caso contrário, null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  /**
   * Gera um token de acesso JWT para um usuário autenticado.
   * @param user Objeto do usuário (geralmente o que é retornado por validateUser).
   * @returns Um objeto contendo o access_token.
   */
  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      name: user.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
