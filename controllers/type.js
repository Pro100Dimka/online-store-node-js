const { Type } = require('../models/models');
const apiErrors = require('../errors/api');

class typeController {
  async create(req, res) {
    try {
      const { name } = req.body;
      const type = await Type.create({ name });
      return res.json(type);
    } catch (error) {
      next(apiErrors.badRequest(error.message));
    }
  }
  async updateItemById(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const type = await Type.findByPk(id);
      if (!type) {
        return next(apiErrors.badRequest('Тип не існує, або його видалено'));
      }
      type.name = name;
      await type.save();
      return res.json(type);
    } catch (error) {
      return next(apiErrors.badRequest('Салася плмилка'));
    }
  }
  async getAllItems(_req, res) {
    const types = await Type.findAndCountAll();
    return res.json(types);
  }
  async getItemById(req, res) {
    const { id } = req.params;
    const type = await Type.findOne({
      where: { id },
    });
    return res.json(type);
  }
  async deleteItemById(req, res, next) {
    const { id } = req.params;
    try {
      const type = await Type.findByPk(id);
      if (!type) {
        return next(
          apiErrors.badRequest('Категорія не існує, або ії видалено')
        );
      }
      await type.destroy();
      return res.json({ message: 'Категорію успішно видалено' });
    } catch (error) {
      return next(apiErrors.badRequest('Сталася помилка'));
    }
  }
}
module.exports = new typeController();
