const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ msg: 'Token não fornecido' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-senha');
      if (roles.length && !roles.includes(req.user.isAdmin ? 'admin' : 'funcionario')) {
        return res.status(403).json({ msg: 'Acesso negado' });
      }
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token inválido' });
    }
  };
};
