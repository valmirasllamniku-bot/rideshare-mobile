# Publikimi në Vercel dhe hyrjet

## Publikimi

1. Importoje repository-n në Vercel nga GitHub.
2. Te Project Settings → Build and Deployment, vendose **Root Directory** në `aplikacioni`.
3. Shto variablat e mëposhtme te Project Settings → Environment Variables, për Production:
   - `DATABASE_URL`
   - `GITHUB_ID`
   - `GITHUB_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` me adresën HTTPS të projektit, p.sh. `https://emri.vercel.app`
4. Bëje Deploy. Ruaje adresën `*.vercel.app`; kjo është adresa që duhet hapur dhe instaluar në telefon.

Mos i vendos vlerat sekrete në GitHub ose në këtë skedar. Shtoji direkt në Vercel.

## Google OAuth

Në Google Cloud Console krijo OAuth Client për **Web application**. Te Authorized JavaScript origins vendos:

- `http://localhost:3000`
- `https://emri.vercel.app`

Te Authorized redirect URIs vendos adresat përkatëse:

- `http://localhost:3000/api/auth/callback/google`
- `https://emri.vercel.app/api/auth/callback/google`

Google kërkon që redirect URI të përputhet saktësisht me adresën e autorizuar. Nëse Vercel jep domen tjetër, përdore atë domen në të dyja vendet dhe te `NEXTAUTH_URL`.

## GitHub OAuth dhe rolet

Në GitHub OAuth App, ruaje callback-un lokal dhe shto callback-un e domenit Vercel:

- `http://localhost:3000/api/auth/callback/github`
- `https://emri.vercel.app/api/auth/callback/github`

Profili GitHub që është shënuar `admin` në Neon mbetet administratori. Hyrja e re me Google krijon profil klienti; rolet ekzistuese nuk mbishkruhen.

## Telefoni

Hape adresën `https://emri.vercel.app` në shfletuesin e telefonit dhe instaloje si aplikacion nga menyja e shfletuesit. Pas çdo Deploy-i, hape aplikacionin me internet që service worker të marrë versionin e ri. Hyrja, kërkesat dhe njoftimet kërkojnë lidhje interneti.