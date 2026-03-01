const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  cpf: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
  telefone: String,
  dataNascimento: Date,
  nome: { type: String, required: true },
  endereco: String,
  idFuncionario: { type: Number, unique: true, sparse: true },
  senha: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 12);
  }
  next();
});

userSchema.methods.compareSenha = async function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('User', userSchema);
