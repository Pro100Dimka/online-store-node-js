const { Brand } = require('../models/models');
const apiError = require('../errors/api');

class brandController {
  async createItem(req, res) {
    try {
      const { name } = req.body;
      const brand = await Brand.create({ name });
      return res.json(brand);
    } catch (error) {
      next(apiError.badRequest(error.message));
    }
  }
  async updateItemById(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return next(apiError.badRequest('Бренд не існує, або його видалено'));
      }
      brand.name = name;
      await brand.save();
      return res.json(brand);
    } catch (error) {
      return next(apiError.badRequest('Салася плмилка'));
    }
  }
  async getAllItems(_req, res) {
    const brand = await Brand.findAndCountAll();
    return res.json(brand);
  }
  async getItemById(req, res) {
    const { id } = req.params;
    const brand = await Brand.findOne({
      where: { id },
    });
    return res.json(brand);
  }
  async deleteItemById(req, res, next) {
    const { id } = req.params;
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return next(apiError.badRequest('Бренд не існує, або його видалено'));
      }
      await brand.destroy();
      return res.json({ message: 'Бренд успішно видалено' });
    } catch (error) {
      return next(apiError.badRequest('Сталася помилка'));
    }
  }
}
module.exports = new brandController();
