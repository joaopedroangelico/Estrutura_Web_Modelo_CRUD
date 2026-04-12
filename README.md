# Sistema de Gestão de Oficina Mecânica

Sistema web CRUD para gerenciamento de ordens de serviço de uma oficina mecânica.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Comunicação | REST API + fetch |

---

## Funcionalidades

- Login com autenticação por usuário e senha
- Listagem de ordens de serviço com filtro por status e busca por placa/CPF
- Cadastro de nova ordem de serviço (com veículo e proprietário)
- Edição de ordem de serviço existente
- Exclusão de ordem de serviço
- Modal de detalhes completos da OS

---

## Estrutura do Projeto

```
Estrutura_Web_Modelo_CRUD/
├── mecanica-backend/
│   ├── server.js        # API REST (Express)
│   ├── db.js            # Conexão com PostgreSQL
│   ├── schema.sql       # Criação das tabelas e dados de exemplo
│   ├── .env             # Configuração do banco (não versionado)
│   └── package.json
├── mecanica-frontend/
│   ├── src/
│   │   ├── App.jsx               # Roteamento e navbar
│   │   ├── main.jsx              # Ponto de entrada
│   │   └── pages/
│   │       ├── Login.jsx         # Tela de login
│   │       ├── Dashboard.jsx     # Lista de ordens de serviço
│   │       ├── CadastroVeiculos.jsx  # Nova OS
│   │       └── EditarVeiculo.jsx     # Editar/excluir OS
│   └── package.json
├── docs/                # Diagramas C4
├── package.json         # Script para rodar tudo junto
└── README.md
```

---

## Banco de Dados

### Tabelas

**proprietarios**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | Chave primária |
| cpf | VARCHAR(14) | CPF único |
| nome | VARCHAR(100) | Nome completo |
| telefone | VARCHAR(15) | Telefone |
| email | VARCHAR(100) | E-mail |

**veiculos**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | Chave primária |
| placa | VARCHAR(8) | Placa única |
| modelo | VARCHAR(80) | Modelo do veículo |
| cor | VARCHAR(40) | Cor |
| proprietario_id | INTEGER | FK para proprietarios |

**ordens_servico**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | Chave primária |
| codigo | VARCHAR(10) | Código único (ex: OS-001) |
| veiculo_id | INTEGER | FK para veiculos |
| descricao | TEXT | Descrição do serviço |
| status | VARCHAR(20) | iniciado / em andamento / finalizado |
| valor | NUMERIC(10,2) | Valor do serviço |
| criado_em | TIMESTAMP | Data de abertura |
| atualizado_em | TIMESTAMP | Última atualização |

---

## API — Endpoints

Base URL: `http://localhost:3001`

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/ordens` | Lista todas as OS (aceita `?status=` e `?busca=`) |
| GET | `/ordens/:codigo` | Busca uma OS pelo código (ex: OS-001) |
| POST | `/ordens` | Cria nova OS com veículo e proprietário |
| PUT | `/ordens/:codigo` | Atualiza uma OS existente |
| DELETE | `/ordens/:codigo` | Exclui uma OS |

### Exemplo — POST /ordens

```json
{
  "veiculo": {
    "placa": "ABC1234",
    "modelo": "Honda Civic",
    "cor": "Prata",
    "descricao": "Troca de óleo",
    "status": "iniciado",
    "valor": 380.00
  },
  "proprietario": {
    "cpf": "123.456.789-00",
    "nome": "João Silva",
    "telefone": "(41) 99999-0001",
    "email": "joao@email.com"
  }
}
```

---

## Como Rodar

### Pré-requisitos

- [Node.js](https://nodejs.org) 18+
- [PostgreSQL](https://postgresql.org/download/windows) 16+

### 1. Configurar o banco de dados

Abra o pgAdmin, crie um banco chamado `oficina_mecanica` e execute o arquivo `mecanica-backend/schema.sql` pelo Query Tool.

### 2. Configurar o arquivo `.env`

Edite o arquivo `mecanica-backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oficina_mecanica
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3001
```

### 3. Instalar dependências (primeira vez)

Na raiz do projeto:

```bash
npm install
npm install --prefix mecanica-backend
npm install --prefix mecanica-frontend
```

### 4. Iniciar o sistema

```bash
npm start
```

Isso inicia o backend e o frontend simultaneamente.

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:3001 |

### Credenciais de acesso

| Usuário | Senha |
|---------|-------|
| admin | 1234 |

---

## Diagramas

Os diagramas de arquitetura no padrão C4 estão na pasta `docs/`:

- `c4-nivel1-contexto.puml` — Contexto do sistema
- `c4-nivel2-container.puml` — Containers
- `c4-nivel3-componente.puml` — Componentes
- `c4-nivel4-codigo.puml` — Código

---

## Autor

Desenvolvido por **João Pedro Angelico** — 5º Semestre, Desenvolvimento Web  
Católica SC — 2025/2026
