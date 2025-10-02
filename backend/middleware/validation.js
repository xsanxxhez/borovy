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

const validateVakhta = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().allow('').optional(),
    location: Joi.string().min(3).max(200).required(),
    total_places: Joi.number().integer().min(1).max(1000).required(),
    start_date: Joi.date().greater('now').required(),
    end_date: Joi.date().greater(Joi.ref('start_date')).required(),
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
