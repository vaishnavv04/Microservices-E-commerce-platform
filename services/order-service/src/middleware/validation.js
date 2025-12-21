const Joi = require('joi');

const validateCreateOrder = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required(),
    shippingAddress: Joi.string().optional(),
    paymentIntentId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateUpdateOrderStatus = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled').required(),
    trackingNumber: Joi.string().optional(),
    userEmail: Joi.string().email().optional(),
    userPhone: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateProcessOrderWithPayment = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required(),
    shippingAddress: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateConfirmOrderPayment = (req, res, next) => {
  const schema = Joi.object({
    orderId: Joi.number().integer().required(),
    paymentIntentId: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateProcessOrderWithPayment,
  validateConfirmOrderPayment,
};

