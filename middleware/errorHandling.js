const apiErrors = require('../errors/api');

// Вывод ошибки если апишка не сработала
module.exports = function (err, req, res, next) {
  if (err instanceof apiErrors) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Не передбачуванна помилка' });
};
