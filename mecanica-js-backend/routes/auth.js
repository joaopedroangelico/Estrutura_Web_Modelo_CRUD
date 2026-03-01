const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Próximo ID funcionario (simples contador)
const getNextIdFuncionario = async () => {
  const count = await User.countDocuments();
  return count + 1;
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { cpf, senha } = req.body;
    const user = await User.findOne({ cpf });
    if (!user || !(await user.compareSenha(senha))) {
      return res.status(401).json({ erro: 'CPF ou senha inválidos' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.isAdmin ? 'admin' : 'funcionario' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: { id: user._id, nome: user.nome, role: user.isAdmin ? 'admin' : 'funcionario' }
    });
  } catch (err) {
    res.status(500).json({ erro: 'Erro servidor' });
  }
});

// POST /api/auth/register - Admin only (adicione middleware depois)
router.post('/register', async (req, res) => {
  try {
    req.body.idFuncionario = await getNextIdFuncionario();
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ msg: 'Funcionário cadastrado', id: user.idFuncionario });
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// Seed Admin inicial (rode POST /api/auth/seed uma vez)
router.post('/seed', async (req, res) => {
  try {
    const adminExists = await User.findOne({ cpf: '00000000000' });
    if (adminExists) return res.json({ msg: 'Admin já existe' });
    const admin = new User({
      cpf: '00000000000',
      nome: 'Admin Inicial',
      email: 'admin@mecanica.com',
      senha: 'admin123',
      isAdmin: true,
      idFuncionario: 1
    });
    await admin.save();
    res.json({ msg: 'Admin criado! Login: 00000000000 / admin123' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
