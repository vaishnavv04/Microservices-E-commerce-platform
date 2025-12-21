# Development Guide

## Testing Without API Keys

You can develop and test the platform **without** Stripe, SendGrid, or Twilio API keys! The services will automatically use mock/development mode.

### What Works Without API Keys:

✅ **All Core Services:**
- User Service (registration, login, profiles)
- Product Service (CRUD operations, categories, inventory)
- Cart Service (add/remove items, update quantities)
- Order Service (create orders, track status)

✅ **Payment Service (Mock Mode):**
- Payment intents will be created with mock IDs
- Payment confirmations will succeed automatically
- Refunds will work in mock mode
- **Note:** No actual payments will be processed

✅ **Notification Service (Mock Mode):**
- Emails will be logged to console instead of being sent
- SMS will be logged to console instead of being sent
- Order confirmations and shipping updates will work (just logged)

### Setting Up Without API Keys:

1. **Copy the example env file:**
   ```bash
   cp env.example .env
   ```

2. **Set your Supabase DATABASE_URL** (required):
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.project.supabase.co:5432/postgres
   ```

3. **Set a JWT_SECRET** (required):
   ```env
   JWT_SECRET=any-random-string-for-development
   ```

4. **Leave API keys as placeholders** - they'll work in mock mode:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   ```

### Testing the Platform:

1. **Start services** (without Docker):
   ```bash
   # Terminal 1 - User Service
   cd services/user-service
   npm install
   npm run dev

   # Terminal 2 - Product Service
   cd services/product-service
   npm install
   npm run dev

   # Terminal 3 - Cart Service
   cd services/cart-service
   npm install
   npm run dev

   # Terminal 4 - Order Service
   cd services/order-service
   npm install
   npm run dev

   # Terminal 5 - Payment Service
   cd services/payment-service
   npm install
   npm run dev

   # Terminal 6 - Notification Service
   cd services/notification-service
   npm install
   npm run dev
   ```

2. **Test the workflow:**
   - Register a user → Login → Get products → Add to cart → Create order → Process payment
   - Check console logs for mock emails/SMS

### When You're Ready for Real API Keys:

1. **Stripe** (for real payments):
   - Sign up at https://stripe.com
   - Get test keys from Dashboard > Developers > API keys
   - Update `.env` with real keys

2. **SendGrid** (for real emails):
   - Sign up at https://sendgrid.com (free tier available)
   - Create API key from Settings > API Keys
   - Update `.env` with real key

3. **Twilio** (for real SMS - optional):
   - Sign up at https://twilio.com (free trial available)
   - Get credentials from Console
   - Update `.env` with real credentials

### Mock Mode Indicators:

When services are in mock mode, you'll see warnings in the console:
- `⚠️  Stripe not configured - using mock payment intent`
- `⚠️  SendGrid not configured - logging email instead`
- `⚠️  Twilio not configured - logging SMS instead`

These are normal and expected when API keys aren't configured!

