const Joi = require('joi');

const validateSlon = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    display_name: Joi.string().min(2).max(100).required(),
    contact_phone: Joi.string().allow('').optional(),
    contact_email: Joi.string().email().allow('').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validatePromoCode = (req, res, next) => {
  const schema = Joi.object({
    code: Joi.string().pattern(/^[a-zA-Z0-9_-]{4,50}$/).required(),
    description: Joi.string().max(200).allow('').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// В validation.js - улучшенная валидация для вахт
const validateVakhta = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required().messages({
      'string.min': 'Название вахты должно содержать минимум 5 символов',
      'string.max': 'Название вахты не должно превышать 200 символов',
      'any.required': 'Название вахты обязательно'
    }),
    description: Joi.string().allow('').optional(),
    location: Joi.string().min(3).max(200).required().messages({
      'any.required': 'Местоположение обязательно'
    }),
    total_places: Joi.number().integer().min(1).max(1000).required().messages({
      'number.min': 'Количество мест должно быть не менее 1',
      'number.max': 'Количество мест не должно превышать 1000',
      'any.required': 'Количество мест обязательно'
    }),
    start_date: Joi.date().greater('now').required().messages({
      'date.greater': 'Дата начала должна быть в будущем',
      'any.required': 'Дата начала обязательна'
    }),
    end_date: Joi.date().greater(Joi.ref('start_date')).required().messages({
      'date.greater': 'Дата окончания должна быть после даты начала',
      'any.required': 'Дата окончания обязательна'
    }),
    requirements: Joi.string().allow('').optional(),
    conditions: Joi.string().allow('').optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
const validateBorov = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(20).required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(2).max(200).required(),
    birth_date: Joi.date().max(new Date().setFullYear(new Date().getFullYear() - 18)).required(),
    promo_code: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateSlon,
  validatePromoCode,
  validateVakhta,
  validateBorov
};
