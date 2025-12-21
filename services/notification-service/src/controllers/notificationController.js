const { sendEmail, sendOrderConfirmation, sendShippingUpdate } = require('../utils/email');
const { sendSMS, sendOrderConfirmationSMS, sendShippingUpdateSMS } = require('../utils/sms');

const sendEmailNotification = async (req, res) => {
  try {
    const { to, subject, text, html, type, data } = req.body;

    let result;

    if (type === 'order_confirmation' && data) {
      result = await sendOrderConfirmation(to, data);
    } else if (type === 'shipping_update' && data) {
      result = await sendShippingUpdate(to, data);
    } else if (to && subject && text) {
      result = await sendEmail(to, subject, text, html);
    } else {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    res.json({
      message: 'Email notification sent',
      ...result,
    });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
};

const sendSMSNotification = async (req, res) => {
  try {
    const { to, message, type, data } = req.body;

    let result;

    if (type === 'order_confirmation' && data) {
      result = await sendOrderConfirmationSMS(to, data);
    } else if (type === 'shipping_update' && data) {
      result = await sendShippingUpdateSMS(to, data);
    } else if (to && message) {
      result = await sendSMS(to, message);
    } else {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    res.json({
      message: 'SMS notification sent',
      ...result,
    });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message,
    });
  }
};

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
};

