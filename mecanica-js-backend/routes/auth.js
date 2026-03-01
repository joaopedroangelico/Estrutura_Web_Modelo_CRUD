const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

// Cria ID sequencial simples (use contador DB em prod)
const getNextId = async () => {
  const last = await User.findOne().sort({ idFuncionario: -1 });
  return (last?.idFuncionario || 0) + 1;
};

// Login
router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  const user = await User.findOne({ cpf });
  if (!user || !(await user.compareSenha(senha))) {
    return res.status(400).json({ msg: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.isAdmin ? 'admin' : 'funcionario' });
});

// CRUD Users (Admin only)
router.post('/users', auth(['admin']), async (req, res) => {
  req.body.idFuncionario = await getNextId();
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});
// Adicione GET/PUT/DELETE similar, protegido admin

// Seed Admin inicial (rode 1x)
router.post('/seed-admin', async (req, res) => {
  const admin = new User({ cpf: '12345678901', nome: 'Admin', senha: 'admin123', isAdmin: true, idFuncionario: 1 });
  await admin.save();
  res.json({ msg: 'Admin criado' });
});

module.exports = router;
