const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const isSendGridConfigured = SENDGRID_API_KEY &&
  SENDGRID_API_KEY !== 'your_sendgrid_api_key' &&
  SENDGRID_API_KEY.length > 0 &&
  SENDGRID_API_KEY.startsWith('SG.');

if (isSendGridConfigured) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

const sendEmail = async (to, subject, text, html = null) => {
  // Mock mode if SendGrid is not configured
  if (!isSendGridConfigured) {
    console.warn('⚠️  SendGrid not configured - logging email instead');
    console.log('='.repeat(50));
    console.log('📧 MOCK EMAIL');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text);
    console.log('='.repeat(50));
    return {
      success: true,
      message: 'Email logged (SendGrid not configured)',
      mock: true
    };
  }

  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ecommerce.com',
      subject,
      text,
      html: html || text,
    };

    await sgMail.send(msg);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('SendGrid error:', error);
    throw error;
  }
};

const sendOrderConfirmation = async (to, orderData) => {
  const subject = `Order Confirmation - Order #${orderData.orderId}`;
  const text = `
    Thank you for your order!
    
    Order ID: ${orderData.orderId}
    Total Amount: $${orderData.totalAmount}
    Status: ${orderData.status}
    
    Your order has been received and is being processed.
  `;
  const html = `
    <h2>Thank you for your order!</h2>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>Total Amount:</strong> $${orderData.totalAmount}</p>
    <p><strong>Status:</strong> ${orderData.status}</p>
    <p>Your order has been received and is being processed.</p>
  `;

  return await sendEmail(to, subject, text, html);
};

const sendShippingUpdate = async (to, orderData) => {
  const subject = `Shipping Update - Order #${orderData.orderId}`;
  const text = `
    Your order status has been updated!
    
    Order ID: ${orderData.orderId}
    New Status: ${orderData.status}
    ${orderData.trackingNumber ? `Tracking Number: ${orderData.trackingNumber}` : ''}
  `;
  const html = `
    <h2>Your order status has been updated!</h2>
    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
    <p><strong>New Status:</strong> ${orderData.status}</p>
    ${orderData.trackingNumber ? `<p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>` : ''}
  `;

  return await sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendShippingUpdate,
};

