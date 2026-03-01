const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth(['admin'])); // Todos protegidos admin

// GET /api/users - lista
router.get('/', async (req, res) => {
  const users = await User.find().select('-senha').sort('idFuncionario');
  res.json(users);
});

// POST /api/users - criar
router.post('/', async (req, res) => {
  const idFuncionario = await (async () => {
    const last = await User.findOne().sort({ idFuncionario: -1 });
    return (last?.idFuncionario || 0) + 1;
  })();
  req.body.idFuncionario = idFuncionario;
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// PUT /api/users/:id - update
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-senha');
  if (!user) return res.status(404).json({ erro: 'User não encontrado' });
  res.json(user);
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User deletado' });
});

module.exports = router;
