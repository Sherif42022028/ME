# ME — Mica Ella Admin Dashboard & Neon Database Integration

Production-ready Admin Dashboard and Backend API for **ME — Mica Ella**, a luxury pre-loved fashion e-commerce brand (Philippines market, PHP `₱` currency).

Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Neon PostgreSQL**, **Prisma ORM**, **Zod**, **bcryptjs**, and **Recharts**.

---

## 🌟 Key Features

- **Neon PostgreSQL Integration**: Real-time database queries using Prisma ORM with 23 database models and indexes.
- **Robust Authentication & Email Normalization**: RFC-compliant Zod validation with email normalization (`trim` + `lowercase`).
- **Server-Side Authorization**: Protected `/admin` routes and `/api/admin/*` endpoints guarded by server middleware.
- **Real Analytics Engine**: Revenue timeline charts, AOV (`Total Revenue / Completed Orders`), traffic sources breakdown, and visitor conversion funnel calculated from database events.
- **1-of-1 Inventory & Oversell Prevention**: Stock decrement transactions preventing overselling (`stock = 1` $\rightarrow$ `stock = 0` $\rightarrow$ `SOLD`) with complete `InventoryLog` audit history.
- **Orders & Timeline History**: Orders management with status filters and mandatory `OrderStatusHistory` logging.
- **WhatsApp Cloud API Integration**: Real-time conversation hub, "ASK ABOUT THIS ITEM" product context, and webhook endpoint (`/api/webhooks/whatsapp`) featuring verification token handling, HMAC signatures, and event idempotency (`WebhookEvent`).
- **CMS Content Management**: Editable Founder Profile (Micaela Ella), homepage banners, policies, and FAQs.
- **CSV Data Exporter**: Export real database records for Orders, Products, Customers, and Sales Reports.

---

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```env
DATABASE_URL="postgresql://neondb_owner:npg_Een1TaWXYrR7@ep-small-haze-ayv0cuvg-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

ADMIN_EMAIL="micaela.ella.admin@gmail.com"
ADMIN_PASSWORD="MeAdminPass2026!Secure"
AUTH_SECRET="super-secret-me-jwt-token-key-2026-micaela-ella"

WHATSAPP_ACCESS_TOKEN="EAAG_sample_whatsapp_cloud_api_access_token_me_2026"
WHATSAPP_PHONE_NUMBER_ID="109876543210987"
WHATSAPP_BUSINESS_ACCOUNT_ID="123456789012345"
WHATSAPP_VERIFY_TOKEN="me_whatsapp_webhook_verify_token_2026"
```

### 3. Generate Prisma Client & Push Schema to Neon
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Neon Database
```bash
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000/login](http://localhost:3000/login) to sign in with your configured admin email and password.

---

## 🔒 Security & Verification Checklist

- [x] Passwords securely hashed with `bcryptjs` (salt rounds = 10).
- [x] Sessions stored in HTTP-only `me_admin_session` cookies.
- [x] Zod RFC email normalization prevents casing or whitespace login failures (`Sherif@Gmail.com` $\rightarrow$ `sherif@gmail.com`).
- [x] Unauthorized direct visits to `/admin` or `/admin/orders` automatically redirect to `/login`.
- [x] WhatsApp Cloud API webhooks check `WebhookEvent` table for idempotency to prevent duplicate message ingestion.
