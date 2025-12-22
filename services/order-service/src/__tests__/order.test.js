const request = require('supertest');
const app = require('../index');

describe('Order Service', () => {
    describe('GET /health', () => {
        it('should return health status', async () => {
            const response = await request(app).get('/health');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('ok');
            expect(response.body.service).toBe('order-service');
        });
    });
});
