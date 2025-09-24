# Chart2Signals by BetSpread

Next.js 14-app som extraherar prisdata ur uppladdade grafer och levererar tekniska signaler och riskplaner. Projektet är konfigurerat för GitHub → Vercel med pnpm och Node 20.

## 🚀 Funktioner

- Bild- och CSV-uppladdning som konverteras till OHLC-serier via OpenAI Vision (gpt-4o-mini) eller heuristisk OpenCV-fallback.
- Tekniska indikatorer (SMA, EMA, RSI, MACD, Bollinger, ATR) och modulära signalregler med riskplan (entry/SL/TP).
- Resultatsida med Recharts-graf, signalpilar, export till PNG/CSV/JSON samt sammanfattning.
- Svensk UI-copy, SEO-metadata och OG-bild via `/api/og`.
- Pricing-sida med FAQ, CTA-sticka i sidfoten och Pro-gate (`ENABLE_PRO`).
- NextAuth med magisk dev-länk (utan SMTP) som exponeras på `/auth/dev` samt `/api/dev/pro` för att toggla PRO-status.
- Mockade webhookar (`/api/webhook`) med idempotens och statuslogg (`/api/status`, dev-sida `/status`).
- Vitest-testning av indikatorer och signalmotor i `tests/`.

## 🛠️ Setup lokalt

```bash
pnpm i
cp .env.example .env.local
pnpm dev
```

## 🔐 Env-variabler (Production + Preview)

```env
NEXT_PUBLIC_SITE_URL=...
NEXTAUTH_SECRET=...
ENABLE_PRO=false
OPENAI_API_KEY=
OPENAI_VISION_MODEL=gpt-4o-mini
STATUS_TOKEN=
DEV_ADMIN_TOKEN=
WEBHOOK_PROVIDER=stripe
WEBHOOK_SECRET=
WEBHOOK_IDEMP_TTL_MS=7200000
```

## 🚀 Deploy på Vercel

- **Framework Preset:** Next.js
- **Root Directory:** `/` (repo-rot)
- **Node:** 20.x (respektera `package.json` engines)
- **Install Command:** `pnpm install --no-frozen-lockfile`
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- Lägg miljövariablerna ovan i Vercel (Production + Preview) och redeploya.
- GitHub flow: PR → Vercel Preview → merge till `main` → Production Deploy.

## 🖼️ Exempelbilder

Lägg till egna grafer i `public/examples/` via GitHub efteråt (`Add file → Upload files`).

## 🧪 Tester

```bash
pnpm test -- --run
```

## 🧭 Användning

1. Ladda upp en grafbild eller CSV och välj indikatorer.
2. Analysera och få resultat med signaler, riskplan och export (PNG/CSV/JSON).
3. Använd Pro-gate för att låsa upp extra funktioner via `/api/dev/pro` (kräver token).
4. Logga in via dev-maginlänk och följ webhook/status-flödena.

Lycka till med din deploy!
