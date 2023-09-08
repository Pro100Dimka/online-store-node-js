const jwt = require('jsonwebtoken');
// проверка авторизирован ли пользователь
module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') next();
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token)
      return res.status(401).json({ message: 'Користувач не авторизован' });
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Користувач не авторизован' });
  }
};
