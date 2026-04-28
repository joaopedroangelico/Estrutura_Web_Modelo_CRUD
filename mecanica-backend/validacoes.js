// Funções puras de validação — sem acesso ao banco de dados.
// Cada função retorna null se válido, ou uma string de erro se inválido.

function validarPlaca(placa) {
  if (!placa || typeof placa !== 'string') return 'Placa é obrigatória.'
  const limpa = placa.trim().toUpperCase().replace('-', '')
  const antiga = /^[A-Z]{3}\d{4}$/.test(limpa)   // ABC1234
  const mercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/.test(limpa) // ABC1D23
  if (!antiga && !mercosul) return 'Placa inválida. Use o formato ABC-1234 ou ABC1D23.'
  return null
}

function validarCPF(cpf) {
  if (!cpf || typeof cpf !== 'string') return 'CPF é obrigatório.'
  const digitos = cpf.replace(/\D/g, '')
  if (digitos.length !== 11) return 'CPF deve ter 11 dígitos.'
  if (/^(\d)\1{10}$/.test(digitos)) return 'CPF inválido.'
  return null
}

function validarStatus(status) {
  const validos = ['iniciado', 'em andamento', 'finalizado']
  if (!status) return 'Status é obrigatório.'
  if (!validos.includes(status)) return `Status inválido. Use: ${validos.join(', ')}.`
  return null
}

function validarPreco(preco) {
  if (preco === undefined || preco === null || preco === '') return null // opcional
  const valor = parseFloat(preco)
  if (isNaN(valor)) return 'Preço deve ser um número.'
  if (valor < 0) return 'Preço não pode ser negativo.'
  return null
}

function validarVeiculo(veiculo) {
  if (!veiculo) return 'Dados do veículo são obrigatórios.'
  const erroPlaca = validarPlaca(veiculo.placa)
  if (erroPlaca) return erroPlaca
  if (!veiculo.modelo || !veiculo.modelo.trim()) return 'Modelo do veículo é obrigatório.'
  return null
}

function validarProprietario(proprietario) {
  if (!proprietario) return 'Dados do proprietário são obrigatórios.'
  const erroCPF = validarCPF(proprietario.cpf)
  if (erroCPF) return erroCPF
  if (!proprietario.nome || !proprietario.nome.trim()) return 'Nome do proprietário é obrigatório.'
  return null
}

function validarFuncionario(funcionario) {
  if (!funcionario) return 'Dados do funcionário são obrigatórios.'
  if (!funcionario.nome || !funcionario.nome.trim()) return 'Nome é obrigatório.'
  if (!funcionario.usuario || !funcionario.usuario.trim()) return 'Usuário é obrigatório.'
  if (!funcionario.senha || !funcionario.senha.trim()) return 'Senha é obrigatória.'
  const funcoesValidas = ['admin', 'atendente', 'mecanico']
  if (!funcionario.funcao || !funcoesValidas.includes(funcionario.funcao)) {
    return `Função inválida. Use: ${funcoesValidas.join(', ')}.`
  }
  return null
}

module.exports = {
  validarPlaca,
  validarCPF,
  validarStatus,
  validarPreco,
  validarVeiculo,
  validarProprietario,
  validarFuncionario,
}
