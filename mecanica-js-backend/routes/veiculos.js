const express = require('express');
const Veiculo = require('../models/Veiculo');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth(['funcionario', 'admin']));

// GET /api/veiculos - lista
router.get('/', async (req, res) => {
  const { status, placa } = req.query;
  const query = status ? { status } : {};
  if (placa) query.placa = new RegExp(placa, 'i');
  const veiculos = await Veiculo.find(query).sort({ createdAt: -1 });
  res.json(veiculos);
});

// POST /api/veiculos - create
router.post('/', async (req, res) => {
  const veiculo = new Veiculo({ ...req.body, placa: req.body.placa.toUpperCase() });
  await veiculo.save();
  res.status(201).json(veiculo);
});

// PUT /api/veiculos/:id - update status/obs
router.put('/:id', async (req, res) => {
  const veiculo = await Veiculo.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
  res.json(veiculo);
});

// DELETE /api/veiculos/:id
router.delete('/:id', async (req, res) => {
  await Veiculo.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Veículo deletado' });
});

module.exports = router;
