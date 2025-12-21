const Joi = require('joi');

const validateCreateIntent = (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).optional().default('usd'),
    orderId: Joi.number().integer().optional(),
    userId: Joi.number().integer().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateConfirm = (req, res, next) => {
  const schema = Joi.object({
    paymentIntentId: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateRefund = (req, res, next) => {
  const schema = Joi.object({
    paymentIntentId: Joi.string().required(),
    amount: Joi.number().positive().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateIntent,
  validateConfirm,
  validateRefund,
};

