const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

const isTwilioConfigured = accountSid && 
  authToken && 
  accountSid !== 'your_twilio_account_sid' &&
  authToken !== 'your_twilio_auth_token' &&
  accountSid.startsWith('AC');

let client = null;

if (isTwilioConfigured) {
  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.warn('⚠️  Failed to initialize Twilio client - falling back to mock mode:', error.message);
    client = null;
  }
}

const sendSMS = async (to, message) => {
  // Mock mode if Twilio is not configured
  if (!client) {
    console.warn('⚠️  Twilio not configured - logging SMS instead');
    console.log('='.repeat(50));
    console.log('📱 MOCK SMS');
    console.log('To:', to);
    console.log('Message:', message);
    console.log('='.repeat(50));
    return {
      success: true,
      message: 'SMS logged (Twilio not configured)',
      sid: 'SM_mock_' + Date.now(),
      mock: true,
    };
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromPhone,
      to,
    });

    return {
      success: true,
      message: 'SMS sent successfully',
      sid: result.sid,
    };
  } catch (error) {
    console.error('Twilio error:', error);
    throw error;
  }
};

const sendOrderConfirmationSMS = async (to, orderData) => {
  const message = `Order #${orderData.orderId} confirmed! Total: $${orderData.totalAmount}. Thank you for your purchase!`;
  return await sendSMS(to, message);
};

const sendShippingUpdateSMS = async (to, orderData) => {
  const message = `Order #${orderData.orderId} status: ${orderData.status}${orderData.trackingNumber ? `. Track: ${orderData.trackingNumber}` : ''}`;
  return await sendSMS(to, message);
};

module.exports = {
  sendSMS,
  sendOrderConfirmationSMS,
  sendShippingUpdateSMS,
};

