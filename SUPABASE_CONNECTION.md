# Supabase Connection Setup

## Issue: IPv6 DNS Resolution

Your Supabase project resolves to IPv6, but your system may not have IPv6 connectivity configured properly. 

## Solution: Use Session Pooler

Instead of **Direct Connection**, use **Session Pooler** which is IPv4 compatible.

### Steps:

1. **Go to Supabase Dashboard:**
   - Open your project: https://supabase.com/dashboard/project/qcohhojysvdrgscbczhj
   - Click **Settings** → **Database**
   - Scroll to **Connection string**

2. **Select Session Pooler:**
   - Change **Method** from "Direct connection" to **"Session pooler"**
   - Keep **Type** as "URI"
   - Keep **Source** as "Primary Database"

3. **Copy the connection string:**
   - It will look like: `postgresql://postgres:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - Note: Port is **6543** (not 5432) and hostname uses `pooler.supabase.com`

4. **Update your `.env` file:**
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
   ```
   Replace:
   - `YOUR_PASSWORD` with your actual password
   - `REGION` with your Supabase region (e.g., `ap-south-1`, `us-east-1`, etc.)

5. **Restart services:**
   ```powershell
   npm start
   ```

## Alternative: Enable IPv6 on Your System

If you prefer to use Direct Connection, you need to ensure IPv6 is enabled:
- Windows: Check network adapter settings
- Verify IPv6 connectivity: `ping -6 db.qcohhojysvdrgscbczhj.supabase.co`

## Why Session Pooler?

- ✅ IPv4 compatible (works everywhere)
- ✅ Better for serverless/stateless applications
- ✅ Handles connection pooling automatically
- ✅ Same database, just different connection method




