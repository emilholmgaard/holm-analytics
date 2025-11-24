# Deployment Guide

## GitHub Setup

Projektet er allerede oprettet på GitHub: https://github.com/emilholmgaard/holm-analytics

### Push til GitHub

Hvis du har problemer med SSH, kan du pushe manuelt:

```bash
# Tjek om remote er sat korrekt
git remote -v

# Hvis ikke, tilføj remote:
git remote add origin https://github.com/emilholmgaard/holm-analytics.git

# Push til GitHub
git push -u origin main
```

Hvis du får authentication fejl, kan du:
1. Bruge GitHub CLI: `gh auth login`
2. Eller bruge personal access token

## Vercel Deployment

### 1. Import Project i Vercel

1. Gå til [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik på "Add New..." → "Project"
3. Import fra GitHub: Vælg `emilholmgaard/holm-analytics`
4. Klik "Import"

### 2. Configure Environment Variables

I Vercel project settings, tilføj disse environment variables:

```
DATABASE_URL=postgres://59a7d28df3441d323e4d534784a0fa9820ca3abba96a777049eafa51e1916a6c:sk_6lT9NQVyDWwFXi70C9gnU@db.prisma.io:5432/postgres?sslmode=require

NEXT_PUBLIC_BASE_URL=https://www.holmkonsultering.dk
```

**Vigtigt:** 
- Erstat `NEXT_PUBLIC_BASE_URL` med din faktiske Vercel URL hvis den er anderledes
- `DATABASE_URL` skal være din produktion database URL

### 3. Configure Build Settings

Vercel skulle automatisk detektere Next.js, men hvis ikke, sæt:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (eller `prisma generate && next build`)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4. Deploy

1. Klik "Deploy"
2. Vent på deployment at færdiggøre
3. Din app vil være live på `https://holm-analytics-*.vercel.app` (eller dit custom domain)

### 5. Update Base URL

Efter deployment, opdater `NEXT_PUBLIC_BASE_URL` environment variable til din faktiske Vercel URL, og redeploy.

## Post-Deployment

### 1. Test Onboarding Flow

1. Gå til din deployed URL
2. Registrer en ny bruger
3. Tilføj et site
4. Installer scriptet
5. Verificer installation

### 2. Custom Domain (Optional)

Hvis du vil bruge `www.holmkonsultering.dk`:

1. Gå til Vercel project settings → Domains
2. Tilføj `www.holmkonsultering.dk`
3. Følg DNS instruktionerne
4. Opdater `NEXT_PUBLIC_BASE_URL` til `https://www.holmkonsultering.dk`

## Troubleshooting

### Database Connection Issues

- Tjek at `DATABASE_URL` er korrekt i Vercel
- Verificer at Prisma Accelerate URL virker (hvis du bruger det)
- Tjek database logs for connection errors

### Build Errors

- Sørg for at `prisma generate` kører før build
- Tjek at alle dependencies er i `package.json`
- Se build logs i Vercel dashboard

### Script Not Working

- Verificer at `NEXT_PUBLIC_BASE_URL` er sat korrekt
- Tjek browser console for errors
- Verificer at script route (`/api/script/[scriptId]`) virker

