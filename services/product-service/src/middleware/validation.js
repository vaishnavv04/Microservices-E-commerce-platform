const Joi = require('joi');

const validateCreateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    category_id: Joi.number().integer().optional(),
    image_url: Joi.string().uri().optional(),
    inventory: Joi.number().integer().min(0).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    category_id: Joi.number().integer().optional(),
    image_url: Joi.string().uri().optional(),
    inventory: Joi.number().integer().min(0).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateInventory = (req, res, next) => {
  const schema = Joi.object({
    quantity: Joi.number().integer().min(0).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  validateUpdateInventory,
};

