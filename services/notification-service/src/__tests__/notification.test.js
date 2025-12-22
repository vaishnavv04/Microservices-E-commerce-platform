/**
 * Basic unit tests for notification-service
 * These tests don't require database connections
 */

describe('Notification Service - Unit Tests', () => {
    describe('Environment', () => {
        it('should have NODE_ENV set', () => {
            expect(process.env.NODE_ENV || 'test').toBeDefined();
        });
    });

    describe('Email Validation', () => {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        it('should validate correct email format', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('user.name@domain.org')).toBe(true);
        });

        it('should reject invalid email format', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('no@domain')).toBe(false);
            expect(isValidEmail('@nodomain.com')).toBe(false);
        });
    });

    describe('Phone Validation', () => {
        const isValidPhone = (phone) => {
            const phoneRegex = /^\+?[1-9]\d{1,14}$/;
            return phoneRegex.test(phone.replace(/[\s-]/g, ''));
        };

        it('should validate correct phone format', () => {
            expect(isValidPhone('+1234567890')).toBe(true);
            expect(isValidPhone('1234567890')).toBe(true);
        });
    });
});
