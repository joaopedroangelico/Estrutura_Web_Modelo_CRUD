# Sistema de Gestão de Oficina Mecânica

Sistema web para gerenciamento de ordens de serviço, funcionários, peças e serviços de uma oficina mecânica.

---

## Acesso ao sistema

| Ambiente | Endereço |
|---|---|
| Sistema (frontend) | https://mecanica-frontend-ten.vercel.app |
| API (backend) | https://mecanica-backend-juut.onrender.com |
| Verificar saúde | https://mecanica-backend-juut.onrender.com/health |

**Credenciais de teste:**

| Usuário | Senha | Nível |
|---|---|---|
| admin | 1234 | Administrador |
| carlos | 1234 | Funcionário (mecânico) |
| ana | 1234 | Funcionário (atendente) |

---

## Tecnologias

| Parte | Tecnologia | Onde roda |
|---|---|---|
| Telas | React 18 + Vite | Vercel |
| Servidor | Node.js + Express | Render |
| Banco de dados | PostgreSQL | Neon (nuvem) |
| Testes | Jest | GitHub Actions |

---

## Funcionalidades

**Ordens de Serviço**
- Listar todas as OS com filtro por status e busca por placa ou CPF
- Criar nova OS vinculando veículo e proprietário
- Editar descrição, status, valor, atendente e mecânico responsável
- Excluir OS (somente administrador)

**Funcionários**
- Cadastrar com nome, usuário, senha, CPF, telefone, endereço e função
- Editar dados e nível de acesso
- Excluir (somente administrador)

**Itens e Serviços**
- Cadastrar peças/materiais com nome, descrição e preço
- Cadastrar serviços do catálogo com nome, descrição e preço
- Editar e excluir (somente administrador)

**Controle de acesso**
- Administrador: acesso completo
- Funcionário: visualização e criação de OS, sem exclusão e sem edição de valores

---

## Estrutura do projeto

```
Estrutura_Web_Modelo_CRUD/
├── .github/workflows/
│   └── ci.yml                  # Pipeline de CI/CD automático
├── mecanica-backend/
│   ├── server.js               # Rotas da API
│   ├── db.js                   # Conexão com o banco
│   ├── schema.sql              # Criação das tabelas e dados de exemplo
│   ├── validacoes.js           # Regras de validação
│   ├── validacoes.test.js      # Testes unitários (27 testes)
│   └── package.json
├── mecanica-frontend/
│   ├── src/
│   │   ├── App.jsx             # Navegação e barra superior
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── CadastroVeiculos.jsx
│   │       ├── EditarVeiculo.jsx
│   │       ├── Funcionarios.jsx
│   │       ├── Itens.jsx
│   │       └── Servicos.jsx
│   └── package.json
├── docs/
│   ├── README.md               # Este arquivo
│   ├── visao-geral.md          # Explicação do sistema em linguagem simples
│   └── *.puml                  # Diagramas de arquitetura (C4)
├── render.yaml                 # Configuração de deploy do backend
├── vercel.json                 # Configuração de deploy do frontend
└── package.json                # Script para rodar tudo localmente
```

---

## Banco de dados

**funcionarios** — equipe da oficina
| Coluna | Descrição |
|---|---|
| nome, usuario, senha | Dados de acesso |
| funcao | atendente, mecanico, gerente ou outro |
| role | admin ou funcionario |
| cpf, telefone, endereco | Dados pessoais |

**proprietarios** — clientes
| Coluna | Descrição |
|---|---|
| cpf | Identificador único do cliente |
| nome, telefone, email | Dados de contato |

**veiculos** — carros cadastrados
| Coluna | Descrição |
|---|---|
| placa | Identificador único do veículo |
| modelo, cor | Descrição do veículo |
| proprietario_id | Vínculo com o cliente |

**ordens_servico** — serviços realizados
| Coluna | Descrição |
|---|---|
| codigo | Número único (OS-001, OS-002...) |
| descricao, status, valor | Detalhes do serviço |
| atendente_id, mecanico_id | Responsáveis pelo atendimento |

**itens** — peças e materiais
| Coluna | Descrição |
|---|---|
| nome, descricao, preco | Dados da peça |

**servicos_catalogo** — serviços com preço fixo
| Coluna | Descrição |
|---|---|
| nome, descricao, preco | Dados do serviço |

---

## API — principais rotas

Base URL em produção: `https://mecanica-backend-juut.onrender.com`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/login` | Autenticação |
| GET | `/ordens` | Lista todas as OS |
| POST | `/ordens` | Cria nova OS |
| PUT | `/ordens/:codigo` | Atualiza OS |
| DELETE | `/ordens/:codigo` | Exclui OS |
| GET/POST/PUT/DELETE | `/funcionarios` | Gerencia funcionários |
| GET/POST/PUT/DELETE | `/itens` | Gerencia itens |
| GET/POST/PUT/DELETE | `/servicos-catalogo` | Gerencia catálogo |
| GET | `/health` | Verifica status do servidor |

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+

**1. Instalar dependências**
```bash
npm install
npm install --prefix mecanica-backend
npm install --prefix mecanica-frontend
```

**2. Configurar o banco**

Edite `mecanica-backend/.env` escolhendo banco local ou Neon:

```env
# Nuvem (Neon)
DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require

# Local (PostgreSQL instalado na máquina)
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=sua_senha
# DB_NAME=oficina_mecanica

PORT=3001
```

**3. Iniciar**
```bash
npm start
```

| Serviço | Endereço local |
|---|---|
| Sistema | http://localhost:5173 |
| API | http://localhost:3001 |

---

## Testes

```bash
cd mecanica-backend
npm test
```

27 testes cobrindo validações de placa, CPF, status, preço, veículo, proprietário e funcionário.

---

## CI/CD

A cada push na branch `main` o GitHub Actions executa automaticamente:
1. Roda os 27 testes unitários
2. Faz o build do frontend
3. Se tudo passar, o Render e o Vercel publicam a nova versão automaticamente

---

*Desenvolvido por João Pedro Angelico — 5º Semestre, Desenvolvimento Web — Católica SC*
