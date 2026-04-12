-- =============================================
-- SCHEMA: Sistema de Gestão de Oficina Mecânica
-- =============================================

-- Tabela de proprietários (clientes)
CREATE TABLE IF NOT EXISTS proprietarios (
  id        SERIAL PRIMARY KEY,
  cpf       VARCHAR(14) NOT NULL UNIQUE,
  nome      VARCHAR(100) NOT NULL,
  telefone  VARCHAR(15),
  email     VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE IF NOT EXISTS veiculos (
  id               SERIAL PRIMARY KEY,
  placa            VARCHAR(8) NOT NULL UNIQUE,
  modelo           VARCHAR(80) NOT NULL,
  cor              VARCHAR(40),
  proprietario_id  INTEGER NOT NULL REFERENCES proprietarios(id) ON DELETE CASCADE,
  criado_em        TIMESTAMP DEFAULT NOW()
);

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  usuario   VARCHAR(50)  NOT NULL UNIQUE,
  senha     VARCHAR(255) NOT NULL,
  funcao    VARCHAR(50)  NOT NULL,
  role      VARCHAR(20)  NOT NULL DEFAULT 'funcionario',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de ordens de serviço
CREATE TABLE IF NOT EXISTS ordens_servico (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(10) NOT NULL UNIQUE,
  veiculo_id    INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  descricao     TEXT,
  status        VARCHAR(20) NOT NULL DEFAULT 'iniciado'
                  CHECK (status IN ('iniciado', 'em andamento', 'finalizado')),
  valor         NUMERIC(10, 2) DEFAULT 0,
  atendente_id  INTEGER REFERENCES funcionarios(id) ON DELETE SET NULL,
  mecanico_id   INTEGER REFERENCES funcionarios(id) ON DELETE SET NULL,
  criado_em     TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de itens de serviço (peças)
CREATE TABLE IF NOT EXISTS itens (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  preco     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Catálogo de serviços com preço fixo
CREATE TABLE IF NOT EXISTS servicos_catalogo (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  preco     NUMERIC(10, 2) NOT NULL DEFAULT 0,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- DADOS DE EXEMPLO
-- =============================================

-- Funcionários (admin: admin/1234, funcionários: carlos/1234, ana/1234)
INSERT INTO funcionarios (nome, usuario, senha, funcao, role) VALUES
  ('Administrador', 'admin',  '1234', 'gerente',   'admin'),
  ('Carlos Souza',  'carlos', '1234', 'mecanico',  'funcionario'),
  ('Ana Lima',      'ana',    '1234', 'atendente', 'funcionario')
ON CONFLICT (usuario) DO NOTHING;

-- Proprietários
INSERT INTO proprietarios (cpf, nome, telefone, email) VALUES
  ('123.456.789-00', 'João Silva',    '(41) 99999-0001', 'joao@email.com'),
  ('987.654.321-00', 'Maria Oliveira','(41) 99999-0002', 'maria@email.com'),
  ('111.222.333-44', 'Pedro Santos',  '(41) 99999-0003', 'pedro@email.com')
ON CONFLICT (cpf) DO NOTHING;

-- Veículos
INSERT INTO veiculos (placa, modelo, cor, proprietario_id) VALUES
  ('ABC1234', 'Honda Civic',    'Prata',    1),
  ('XYZ5678', 'Toyota Corolla', 'Branco',   2),
  ('DEF9012', 'VW Gol',         'Vermelho', 3)
ON CONFLICT (placa) DO NOTHING;

-- Ordens de serviço
INSERT INTO ordens_servico (codigo, veiculo_id, descricao, status, valor, atendente_id, mecanico_id) VALUES
  ('OS-001', 1, 'Troca de óleo e filtros',        'em andamento', 380.00,  3, 2),
  ('OS-002', 2, 'Revisão completa e alinhamento', 'iniciado',     1200.00, 3, 2),
  ('OS-003', 3, 'Troca de pastilhas de freio',    'finalizado',   250.00,  3, 2)
ON CONFLICT (codigo) DO NOTHING;

-- Itens de serviço (peças)
INSERT INTO itens (nome, descricao, preco) VALUES
  ('Vela de Ignição',   'Vela NGK padrão',            15.00),
  ('Filtro de Óleo',    'Filtro de óleo universal',    25.00),
  ('Pastilha de Freio', 'Pastilha de freio dianteira', 120.00),
  ('Amortecedor',       'Amortecedor dianteiro',       350.00),
  ('Pneu 175/65 R14',   'Pneu radial aro 14',          280.00),
  ('Calota Aro 14',     'Calota plástica aro 14',       45.00)
ON CONFLICT (nome) DO NOTHING;

-- Catálogo de serviços
INSERT INTO servicos_catalogo (nome, descricao, preco) VALUES
  ('Troca de Óleo',      'Troca de óleo + filtro',        80.00),
  ('Revisão Completa',   'Revisão geral do veículo',      350.00),
  ('Troca de Coxim',     'Substituição do coxim',         150.00),
  ('Troca de Vela',      'Troca das velas de ignição',     60.00),
  ('Alinhamento',        'Alinhamento e balanceamento',   120.00),
  ('Troca de Pastilhas', 'Troca das pastilhas de freio',  200.00)
ON CONFLICT (nome) DO NOTHING;
