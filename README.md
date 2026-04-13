# SofraQR

Next.js SaaS MVP for restaurants to:

- sign up and activate after subscription payment
- create digital menus
- generate a QR code for each table
- share a dedicated restaurant menu URL
- send customer orders to WhatsApp without a mobile app

## Stack

- Next.js App Router
- Tailwind CSS
- TypeScript
- Local JSON data store for demo runtime
- Prisma schema included for PostgreSQL production setup
- Paddle-ready onboarding flow with webhook endpoint

## Demo Login

- Email: `demo@sofraqr.com`
- Password: `demo1234`

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_APP_URL`
- `APP_SESSION_SECRET`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_API_KEY`
- `PADDLE_PRICE_ID`
- `PADDLE_WEBHOOK_SECRET`

## Notes

- Current MVP uses `data/runtime.json` as a lightweight local store so the app works immediately.
- Production database structure is defined in [prisma/schema.prisma](/d:/Scan%20Order%20App/prisma/schema.prisma).
- Replace the simulated activation button on onboarding with live Paddle checkout and keep [app/api/payment/paddle-webhook/route.ts](/d:/Scan%20Order%20App/app/api/payment/paddle-webhook/route.ts) connected to Paddle events.
