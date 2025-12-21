const Joi = require('joi');

const validateAddItem = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required(),
    productId: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateItem = (req, res, next) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().min(1).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateAddItem,
  validateUpdateItem,
};

