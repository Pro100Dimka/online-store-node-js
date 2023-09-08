const { Device, DeviceInfo } = require('../models/models');
const path = require('path');
const uuid = require('uuid'); //рандомные идишники
const apiErrors = require('../errors/api');
const fs = require('fs');
const { sequelize, literal } = require('sequelize');

class deviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
      });
      if (info) {
        info = JSON.parse(info);
        info.forEach((el) => {
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          });
        });
      }
      return res.json(device);
    } catch (error) {
      next(apiErrors.badRequest('Елемент з такою назвою вже існує'));
    }
  }
  async updateItemById(req, res, next) {
    try {
      const { id } = req.params;
      let { name, price, brandId, typeId, info } = req.body;
      const { img } = req.files;

      // Проверяем, существует ли устройство с указанным id
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }

      // Если есть новое изображение, перезаписываем его на сервере
      if (img) {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve(__dirname, '..', 'static', device.img);

        // Удаляем старый файл изображения
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Записываем новый файл изображения
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        device.img = fileName;
      }

      // Обновляем остальные свойства устройства
      device.name = name || device.name;
      device.price = price || device.price;
      device.brandId = brandId || device.brandId;
      device.typeId = typeId || device.typeId;
      await device.save();

      // Обновляем информацию о девайсе, если есть
      if (info) {
        info = JSON.parse(info);
        await DeviceInfo.destroy({ where: { deviceId: device.id } });
        info.forEach((el) => {
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (error) {
      next(apiErrors.badRequest(error.message));
    }
  }
  async getAllItems(req, res) {
    let { brandId, typeId, limit, page, sortField, sortOrder } = req.query;
    page = page || 1;
    limit = limit || 10;
    let offset = page * limit - limit;
    let devices;
    let order = [];
    console.log(sortOrder);
    if (sortField && sortOrder) {
      if (
        sortField === 'price' ||
        sortField === 'typeId' ||
        sortField === 'brandId' ||
        sortField === 'rating'
      ) {
        order.push([
          literal('CAST(price AS INTEGER)'),
          sortOrder.toUpperCase(),
        ]);
      } else if (sortField === 'name') {
        order.push([literal('LOWER(name)'), sortOrder.toUpperCase()]);
      }
      // Добавьте обработку других полей здесь, если необходимо
    }
    if (!brandId && !typeId)
      devices = await Device.findAndCountAll({ limit, offset, order });
    if (brandId && !typeId)
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
        order,
      });
    if (!brandId && typeId)
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
        order,
      });
    if (brandId && typeId)
      devices = await Device.findAndCountAll({
        where: { typeId, brandId },
        limit,
        offset,
        order,
      });
    return res.json(devices);
  }
  async deleteItemById(req, res, next) {
    try {
      const { id } = req.params;

      // Проверяем, существует ли устройство с указанным id
      const device = await Device.findByPk(id);
      if (!device) {
        return res
          .status(404)
          .json({ error: 'Товар не існує, або його видалено' });
      }

      const filePath = path.resolve(__dirname, '..', 'static', device.img);

      // Удаляем файл изображения
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Удаляем устройство
      await device.destroy();

      return res.json({ message: 'Товар успішно видалено' });
    } catch (error) {
      next(apiErrors.badRequest(error.message));
    }
  }
  async getItemById(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    });

    return res.json(device);
  }
}
module.exports = new deviceController();
