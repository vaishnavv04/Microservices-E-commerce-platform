const Joi = require('joi');

const validateCreateOrder = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).optional().default('INR'),
    orderId: Joi.number().integer().optional(),
    userId: Joi.number().integer().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateVerify = (req, res, next) => {
  const schema = Joi.object({
    orderId: Joi.string().required(),
    paymentId: Joi.string().optional(), // Optional in mock mode
    signature: Joi.string().optional(), // Optional in mock mode
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateRefund = (req, res, next) => {
  const schema = Joi.object({
    paymentId: Joi.string().required(),
    amount: Joi.number().positive().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateOrder,
  validateVerify,
  validateRefund,
};
