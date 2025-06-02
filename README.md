# Rocketshop Backend API

API backend para um sistema de compras online, construída com NestJS, TypeScript, Prisma e SQLite.

## Funcionalidades Implementadas

* **Gerenciamento de Produtos:**
    * CRUD completo (Criar, Ler, Atualizar, Deletar) para produtos.
    * Campos: título, preço, descrição, categoria, imagem.
* **Gerenciamento de Usuários:**
    * CRUD completo para usuários.
    * Registro de novos usuários com hashing de senha (bcrypt).
    * Campos: email (único), nome (obrigatório), senha.
* **Autenticação:**
    * Login de usuários (email e senha) retornando um token JWT.
    * Proteção de rotas usando JWT e Passport.js.
    * Endpoint para verificar o perfil do usuário autenticado.
* **Carrinho de Compras:**
    * Obter/Criar carrinho para um usuário autenticado.
    * Adicionar itens ao carrinho.
    * Atualizar quantidade de itens no carrinho.
    * Remover itens do carrinho.
    * Limpar todos os itens do carrinho.
    * Finalizar compra (Checkout)
* **Documentação da API:**
    * Geração automática de documentação interativa com Swagger (OpenAPI) disponível em `/api-docs`.
* **Banco de Dados:**
    * Uso do SQLite como banco de dados.
    * Gerenciamento de schema e migrações com Prisma.
    * Seed para popular o banco de dados com produtos iniciais.
* **Validação:**
    * Validação de dados de entrada (DTOs) usando `class-validator` e `class-transformer`.

## Tecnologias Utilizadas

* **Backend:** NestJS ([https://nestjs.com/](https://nestjs.com/))
* **Linguagem:** TypeScript ([https://www.typescriptlang.org/](https://www.typescriptlang.org/))
* **ORM:** Prisma ([https://www.prisma.io/](https://www.prisma.io/))
* **Banco de Dados:** SQLite
* **Autenticação:** Passport.js ([http://www.passportjs.org/](http://www.passportjs.org/)) com estratégias JWT (JSON Web Tokens) e Local.
* **Hashing de Senha:** bcrypt
* **Documentação da API:** Swagger (OpenAPI) via `@nestjs/swagger`
* **Validação:** class-validator, class-transformer
* **Gerenciador de Pacotes:** pnpm (para instalação de dependências e scripts como `start:dev`)

## Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão recomendada: LTS, ex: 18.x, 20.x ou superior)
* [pnpm](https://pnpm.io/installation) (para `pnpm install`, `pnpm run start:dev`, etc.)
* [npm](https://www.npmjs.com/get-npm) (o `npx` vem com o npm, que geralmente é instalado com o Node.js)
* [Git](https://git-scm.com/)

## Setup e Instalação

1.  **Clone o Repositório:**
    ```bash
    git clone <https://github.com/GabrielViniciusss/Rocketlab-backend.git>
    cd Rocketlab-backend
    ```

2.  **Instale as Dependências:**
    Usando pnpm:
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto. Este arquivo guardará suas variáveis de ambiente e **não deve ser comitado no Git** (adicione `.env` ao seu `.gitignore`).

    Adicione as seguintes variáveis ao seu arquivo `/.env`:
    ```env
    # URL de conexão com o banco de dados SQLite
    DATABASE_URL="file:./dev.db"

    # Secret para assinar os JSON Web Tokens (JWT)
    # IMPORTANTE: Use uma string longa, complexa e aleatória.
    # NÃO use um valor de exemplo fraco em produção!
    JWT_SECRET="SEU_SEGREDO_JWT_SUPER_FORTE_E_UNICO_AQUI"
    ```
    *Para `JWT_SECRET`, gere uma string aleatória forte. Você pode usar um gerador de senhas online.*
    *Certifique-se que seu arquivo `src/auth/constants.ts` está lendo `process.env.JWT_SECRET`.*

## Configuração do Banco de Dados

1.  **Execute as Migrações do Prisma:**
    Este comando aplicará todas as migrações pendentes para criar a estrutura do banco de dados conforme definido no `prisma/schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```
    Você será solicitado a dar um nome para a migração se for a primeira vez ou se houver novas mudanças no schema. Esse comando rodará o seed.ts que vai povoar o banco
    de dados com alguns produtos.

## Rodando a Aplicação

1.  **Modo de Desenvolvimento (com watch mode):**
    ```bash
    npm run start:dev
    ```
    A aplicação estará disponível em `http://localhost:3000` (ou a porta configurada).

## Documentação e Uso da API

Para documentação interativa da API, foi usado Swagger UI que está disponível em:

`http://localhost:3000/api-docs`

Através do Swagger UI, você pode visualizar todos os endpoints, seus parâmetros, DTOs de requisição/resposta e testá-los diretamente no navegador.

### Fluxo de Autenticação

1.  **Registro:** Use o endpoint `POST /users` para criar uma nova conta de usuário (fornecendo `email`, `name`, `password`).
2.  **Login:** Use o endpoint `POST /auth/login` com o `email` e `password` do usuário registrado. Se as credenciais estiverem corretas, a API retornará um `access_token` (JWT).
3.  **Acessando Rotas Protegidas:** Para acessar rotas protegidas (como as do Carrinho de Compras ou o perfil do usuário em `/auth/profile`), inclua o `access_token` no cabeçalho `Authorization` da sua requisição, prefixado com `Bearer `:
    ```
    Authorization: Bearer SEU_ACCESS_TOKEN_AQUI
    ```
    No Swagger UI, você pode usar o botão "Authorize" (geralmente no canto superior direito) para configurar o token Bearer globalmente para os testes.

### Principais Grupos de Endpoints

* **Auth (`/auth`):** Login, perfil do usuário autenticado.
* **Users (`/users`):** CRUD para usuários (o registro é feito aqui).
* **Products (`/products`):** CRUD para produtos.
* **Cart (`/cart`):** Gerenciamento do carrinho de compras do usuário autenticado (obter carrinho, adicionar/remover/atualizar itens, limpar carrinho).

---
