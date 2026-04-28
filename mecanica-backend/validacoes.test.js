const {
  validarPlaca,
  validarCPF,
  validarStatus,
  validarPreco,
  validarVeiculo,
  validarProprietario,
  validarFuncionario,
} = require('./validacoes')

// ── validarPlaca ──────────────────────────────────────────────
describe('validarPlaca', () => {
  test('aceita placa antiga válida', () => {
    expect(validarPlaca('ABC-1234')).toBeNull()
    expect(validarPlaca('ABC1234')).toBeNull()
  })

  test('aceita placa Mercosul válida', () => {
    expect(validarPlaca('ABC1D23')).toBeNull()
  })

  test('rejeita placa vazia', () => {
    expect(validarPlaca('')).not.toBeNull()
    expect(validarPlaca(null)).not.toBeNull()
  })

  test('rejeita placa com formato inválido', () => {
    expect(validarPlaca('12345678')).not.toBeNull()
    expect(validarPlaca('AB12345')).not.toBeNull()
    expect(validarPlaca('ABCD123')).not.toBeNull()
  })
})

// ── validarCPF ────────────────────────────────────────────────
describe('validarCPF', () => {
  test('aceita CPF formatado com pontos e traço', () => {
    expect(validarCPF('123.456.789-09')).toBeNull()
  })

  test('aceita CPF apenas com dígitos', () => {
    expect(validarCPF('12345678909')).toBeNull()
  })

  test('rejeita CPF com menos de 11 dígitos', () => {
    expect(validarCPF('1234567')).not.toBeNull()
  })

  test('rejeita CPF com todos os dígitos iguais', () => {
    expect(validarCPF('00000000000')).not.toBeNull()
    expect(validarCPF('11111111111')).not.toBeNull()
  })

  test('rejeita CPF vazio ou nulo', () => {
    expect(validarCPF('')).not.toBeNull()
    expect(validarCPF(null)).not.toBeNull()
  })
})

// ── validarStatus ─────────────────────────────────────────────
describe('validarStatus', () => {
  test('aceita os três status válidos', () => {
    expect(validarStatus('iniciado')).toBeNull()
    expect(validarStatus('em andamento')).toBeNull()
    expect(validarStatus('finalizado')).toBeNull()
  })

  test('rejeita status desconhecido', () => {
    expect(validarStatus('concluido')).not.toBeNull()
    expect(validarStatus('pendente')).not.toBeNull()
  })

  test('rejeita status vazio', () => {
    expect(validarStatus('')).not.toBeNull()
    expect(validarStatus(null)).not.toBeNull()
  })
})

// ── validarPreco ──────────────────────────────────────────────
describe('validarPreco', () => {
  test('aceita preço zero', () => {
    expect(validarPreco(0)).toBeNull()
  })

  test('aceita preço positivo', () => {
    expect(validarPreco(150.99)).toBeNull()
    expect(validarPreco('250.00')).toBeNull()
  })

  test('aceita preço não informado (campo opcional)', () => {
    expect(validarPreco(null)).toBeNull()
    expect(validarPreco(undefined)).toBeNull()
    expect(validarPreco('')).toBeNull()
  })

  test('rejeita preço negativo', () => {
    expect(validarPreco(-1)).not.toBeNull()
  })

  test('rejeita valor não numérico', () => {
    expect(validarPreco('abc')).not.toBeNull()
  })
})

// ── validarVeiculo ────────────────────────────────────────────
describe('validarVeiculo', () => {
  test('aceita veículo válido', () => {
    expect(validarVeiculo({ placa: 'ABC-1234', modelo: 'Gol' })).toBeNull()
  })

  test('rejeita sem placa', () => {
    expect(validarVeiculo({ placa: '', modelo: 'Gol' })).not.toBeNull()
  })

  test('rejeita sem modelo', () => {
    expect(validarVeiculo({ placa: 'ABC-1234', modelo: '' })).not.toBeNull()
  })

  test('rejeita objeto nulo', () => {
    expect(validarVeiculo(null)).not.toBeNull()
  })
})

// ── validarProprietario ───────────────────────────────────────
describe('validarProprietario', () => {
  test('aceita proprietário válido', () => {
    expect(validarProprietario({ cpf: '12345678909', nome: 'João' })).toBeNull()
  })

  test('rejeita sem CPF', () => {
    expect(validarProprietario({ cpf: '', nome: 'João' })).not.toBeNull()
  })

  test('rejeita sem nome', () => {
    expect(validarProprietario({ cpf: '12345678909', nome: '' })).not.toBeNull()
  })
})

// ── validarFuncionario ────────────────────────────────────────
describe('validarFuncionario', () => {
  test('aceita funcionário válido', () => {
    expect(validarFuncionario({ nome: 'Ana', usuario: 'ana', senha: '1234', funcao: 'mecanico' })).toBeNull()
  })

  test('rejeita função inválida', () => {
    expect(validarFuncionario({ nome: 'Ana', usuario: 'ana', senha: '1234', funcao: 'gerente' })).not.toBeNull()
  })

  test('rejeita campos obrigatórios faltando', () => {
    expect(validarFuncionario({ nome: '', usuario: 'ana', senha: '1234', funcao: 'atendente' })).not.toBeNull()
    expect(validarFuncionario({ nome: 'Ana', usuario: '', senha: '1234', funcao: 'atendente' })).not.toBeNull()
    expect(validarFuncionario({ nome: 'Ana', usuario: 'ana', senha: '', funcao: 'atendente' })).not.toBeNull()
  })
})
