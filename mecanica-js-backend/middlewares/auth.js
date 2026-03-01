const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (roles = null) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({ erro: 'Acesso negado por role' });
      }
      next();
    } catch (err) {
      res.status(401).json({ erro: 'Token inválido' });
    }
  };
};
