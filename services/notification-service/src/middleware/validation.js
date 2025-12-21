const Joi = require('joi');

const validateEmail = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().email().required(),
    subject: Joi.string().optional(),
    text: Joi.string().optional(),
    html: Joi.string().optional(),
    type: Joi.string().valid('order_confirmation', 'shipping_update').optional(),
    data: Joi.object().optional(),
  }).or('subject', 'type');

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const validateSMS = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().required(),
    message: Joi.string().optional(),
    type: Joi.string().valid('order_confirmation', 'shipping_update').optional(),
    data: Joi.object().optional(),
  }).or('message', 'type');

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateEmail,
  validateSMS,
};

