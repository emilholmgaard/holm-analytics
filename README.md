# Holm Analytics

En simpel web analytics løsning inspireret af Plausible Analytics. Tilføj et script til din hjemmeside og få web analytics tracking.

## Features

- 🚀 Simpel embeddable script (ligesom Plausible)
- 📊 Dashboard til at se analytics data
- 🔒 Privacy-friendly (ingen cookies, ingen tracking af brugere)
- ⚡ Letvægt og hurtig
- 📱 Tracke page views, referrers, screen size, osv.
- 👤 User authentication og onboarding flow
- 🗄️ PostgreSQL database integration med Prisma
- ✅ Site verification system

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup database

Opret en `.env` fil med:

```env
DATABASE_URL="postgres://your-database-url"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Setup database schema

```bash
npx prisma generate
npx prisma db push
```

### 4. Start development server

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) for at se hjemmesiden.

## Onboarding Flow

1. **Register** - Opret en konto på `/register`
2. **Add Site** - Tilføj dit website på `/sites/add`
3. **Install Script** - Kopiér scriptet til din hjemmeside
4. **Verify** - Verificer installationen

## Script Installation

Efter at have tilføjet et site, får du et unikt script som dette:

```html
<!-- Privacy-friendly analytics by Holm Analytics -->
<script async src="https://www.holmkonsultering.dk/api/script/pa-ABC123"></script>
<script>
  window.holmAnalytics=window.holmAnalytics||function(){(holmAnalytics.q=holmAnalytics.q||[]).push(arguments)},holmAnalytics.init=holmAnalytics.init||function(i){holmAnalytics.o=i||{}};
  holmAnalytics.init()
</script>
```

## Produktion Deployment

### Vercel Deployment

1. Push til GitHub
2. Import projektet i Vercel
3. Tilføj environment variables:
   - `DATABASE_URL` - Din PostgreSQL connection string
   - `NEXT_PUBLIC_BASE_URL` - Din produktion URL (f.eks. `https://www.holmkonsultering.dk`)
4. Deploy!

### Environment Variables

- `DATABASE_URL` - PostgreSQL database connection string
- `NEXT_PUBLIC_BASE_URL` - Base URL for analytics server

## Struktur

- `app/api/` - API endpoints (auth, tracking, sites)
- `app/dashboard/` - Analytics dashboard
- `app/sites/` - Site management pages
- `lib/` - Utilities (auth, storage, prisma)
- `prisma/` - Database schema
- `public/analytics.js` - Embeddable tracking script

## Noter

- Data gemmes i PostgreSQL database
- Scriptet tracker automatisk SPA navigation (pushState/replaceState)
- Ingen cookies eller personlig identifikation
- Hvert site får sit eget unikke script ID

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Plausible Analytics](https://plausible.io) - Inspiration for dette projekt
