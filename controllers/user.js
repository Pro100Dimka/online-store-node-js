const apiError = require('../errors/api');
const bcrypt = require('bcrypt'); // для хеширования паролей
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');
const generateGwt = (id, email, role, phone, name, surname) => {
  return jwt.sign(
    { id, email, role, phone, name, surname },
    process.env.SECRET_KEY,
    {
      expiresIn: '24h',
    }
  );
};
class userController {
  //Регистрация
  async registration(req, res, next) {
    const { email, password, role, phone, name, surname } = req.body;
    if (!email || !password || !phone || !name || !surname)
      return next(apiError.badRequest('Введено не корректні дані'));
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(apiError.badRequest('Користувач з такою поштою вже існує'));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      role,
      password: hashPassword,
      phone,
      name,
      surname,
    });
    // const basket = await Basket.create({ userId: user.id });
    const token = generateGwt(
      user.id,
      user.email,
      user.role,
      user.phone,
      user.name,
      user.surname
    );
    return res.json({ token });
  }

  // Вход
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return next(apiError.internal('Користувача не знайдено з такою поштою'));
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) return next(apiError.internal('Пароль не вірний'));
    const token = generateGwt(
      user.id,
      user.email,
      user.role,
      user.phone,
      user.name,
      user.surname
    );
    return res.json({ token });
  }
  // Проверка авторизирован ли пользователь
  async checkLogin(req, res, next) {
    const token = generateGwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.phone,
      req.user.name,
      req.user.surname
    );
    return res.json({ token });
  }
}
module.exports = new userController();
