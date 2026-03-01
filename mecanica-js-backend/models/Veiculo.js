const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema({
  placa: { type: String, unique: true, required: true },
  cor: String,
  proprietarioNome: String,
  proprietarioCpf: String,
  proprietarioTelefone: String,
  status: { type: String, enum: ['Em Andamento', 'Iniciado', 'Finalizado'], default: 'Em Andamento' },
  observacao: String
}, { timestamps: true });

module.exports = mongoose.model('Veiculo', veiculoSchema);
