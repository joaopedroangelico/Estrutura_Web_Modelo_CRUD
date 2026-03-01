// Exemplo POST
router.post('/', auth(['funcionario', 'admin']), async (req, res) => {
  const veiculo = new Veiculo(req.body);
  await veiculo.save();
  res.status(201).json(veiculo);
});
// GET /, PUT /:id, DELETE /:id igual...
