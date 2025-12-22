const request = require('supertest');
const app = require('../index');

describe('Notification Service', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
            expect(response.body.service).toBe('notification-service');
        });
    });

    describe('POST /notifications/email', () => {
        it('should send email notification (mock mode)', async () => {
            const response = await request(app)
                .post('/notifications/email')
                .send({
                    to: 'test@example.com',
                    subject: 'Test Subject',
                    text: 'Test message body'
                });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });

    describe('POST /notifications/sms', () => {
        it('should send SMS notification (mock mode)', async () => {
            const response = await request(app)
                .post('/notifications/sms')
                .send({
                    to: '+1234567890',
                    message: 'Test SMS message'
                });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
    });
});
