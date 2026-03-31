-- =============================================
-- SCHEMA: Sistema de Gestao de Oficina Mecanica
-- =============================================

-- Tabela de proprietarios (clientes)
CREATE TABLE IF NOT EXISTS proprietarios (
  id        SERIAL PRIMARY KEY,
  cpf       VARCHAR(14) NOT NULL UNIQUE,
  nome      VARCHAR(100) NOT NULL,
  telefone  VARCHAR(15),
  email     VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de veiculos
CREATE TABLE IF NOT EXISTS veiculos (
  id               SERIAL PRIMARY KEY,
  placa            VARCHAR(8) NOT NULL UNIQUE,
  modelo           VARCHAR(80) NOT NULL,
  cor              VARCHAR(40),
  proprietario_id  INTEGER NOT NULL REFERENCES proprietarios(id) ON DELETE CASCADE,
  criado_em        TIMESTAMP DEFAULT NOW()
);

-- Tabela de ordens de servico
CREATE TABLE IF NOT EXISTS ordens_servico (
  id          SERIAL PRIMARY KEY,
  codigo      VARCHAR(10) NOT NULL UNIQUE,  -- ex: OS-001
  veiculo_id  INTEGER NOT NULL REFERENCES veiculos(id) ON DELETE CASCADE,
  descricao   TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'iniciado'
                CHECK (status IN ('iniciado', 'em andamento', 'finalizado')),
  valor       NUMERIC(10, 2) DEFAULT 0,
  criado_em   TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- DADOS DE EXEMPLO (mock)
-- =============================================

INSERT INTO proprietarios (cpf, nome, telefone, email) VALUES
  ('123.456.789-00', 'Joao Silva',    '(41) 99999-0001', 'joao@email.com'),
  ('987.654.321-00', 'Maria Oliveira','(41) 99999-0002', 'maria@email.com'),
  ('111.222.333-44', 'Pedro Santos',  '(41) 99999-0003', 'pedro@email.com')
ON CONFLICT (cpf) DO NOTHING;

INSERT INTO veiculos (placa, modelo, cor, proprietario_id) VALUES
  ('ABC1234', 'Honda Civic',    'Prata',    1),
  ('XYZ5678', 'Toyota Corolla', 'Branco',   2),
  ('DEF9012', 'VW Gol',         'Vermelho', 3)
ON CONFLICT (placa) DO NOTHING;

INSERT INTO ordens_servico (codigo, veiculo_id, descricao, status, valor) VALUES
  ('OS-001', 1, 'Troca de oleo e filtros',        'em andamento', 380.00),
  ('OS-002', 2, 'Revisao completa e alinhamento', 'iniciado',     1200.00),
  ('OS-003', 3, 'Troca de pastilhas de freio',    'finalizado',   250.00)
ON CONFLICT (codigo) DO NOTHING;