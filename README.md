# Holm Analytics

En simpel web analytics løsning inspireret af Plausible Analytics. Tilføj et script til din hjemmeside og få web analytics tracking.

## Features

- 🚀 Simpel embeddable script (ligesom Plausible)
- 📊 Dashboard til at se analytics data
- 🔒 Privacy-friendly (ingen cookies, ingen tracking af brugere)
- ⚡ Letvægt og hurtig
- 📱 Tracke page views, referrers, screen size, osv.

## Getting Started

### 1. Start development server

```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000) for at se hjemmesiden.

### 2. Tilføj script til din hjemmeside

Tilføj dette script til din hjemmeside (i `<head>` eller før `</body>`):

```html
<script 
  defer 
  data-domain="dit-domæne.com" 
  data-api="http://localhost:3000/api/track" 
  src="http://localhost:3000/analytics.js">
</script>
```

**Vigtigt:** 
- Erstat `dit-domæne.com` med dit faktiske domæne
- Hvis du deployer til produktion, opdater `data-api` med din produktion URL

### 3. Se dine analytics

Gå til [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for at se dine analytics data.

## Produktion Deployment

1. Deploy til Vercel, Netlify eller lignende
2. Opdater `data-api` attributten i scriptet til din produktion URL
3. Sæt miljøvariablen `NEXT_PUBLIC_BASE_URL` til din produktion URL

Eksempel:
```html
<script 
  defer 
  data-domain="dit-domæne.com" 
  data-api="https://din-analytics-url.vercel.app/api/track" 
  src="https://din-analytics-url.vercel.app/analytics.js">
</script>
```

## Struktur

- `public/analytics.js` - Embeddable tracking script
- `app/api/track/route.ts` - API endpoint til at modtage tracking data
- `app/dashboard/page.tsx` - Dashboard til at se analytics
- `lib/storage.ts` - Simpel in-memory storage (erstat med database i produktion)

## Noter

- Data gemmes i hukommelsen (in-memory) og går tabt ved server restart
- For produktion, bør du erstatte `lib/storage.ts` med en rigtig database (PostgreSQL, MongoDB, osv.)
- Scriptet tracker automatisk SPA navigation (pushState/replaceState)
- Ingen cookies eller personlig identifikation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Plausible Analytics](https://plausible.io) - Inspiration for dette projekt
