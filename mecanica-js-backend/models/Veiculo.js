const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema({
  placa: { type: String, unique: true, required: true, uppercase: true },
  cor: { type: String, required: true },
  proprietarioNome: { type: String, required: true },
  proprietarioCpf: { type: String, required: true },
  proprietarioTelefone: String,
  status: { 
    type: String, 
    enum: ['Em Andamento', 'Iniciado', 'Finalizado'], 
    default: 'Em Andamento' 
  },
  observacao: String
}, { timestamps: true });

module.exports = mongoose.model('Veiculo', veiculoSchema);
