# Njoftimet në iPhone

## Konfigurimi

1. Në Neon Production, ekzekuto SQL-in te `schema-web-push.sql`.
2. Në terminal, nga dosja `aplikacioni`, gjenero çelësat një herë:

   ```powershell
   npx web-push generate-vapid-keys --json
   ```

3. Në Vercel, shto këto variabla për Production:
   - `VAPID_PUBLIC_KEY` — `publicKey` nga rezultati
   - `VAPID_PRIVATE_KEY` — `privateKey` nga rezultati
   - `VAPID_SUBJECT` — `https://rideshare-mobile-eight.vercel.app`
4. Publiko versionin e ri në Vercel.

Mos e vendos `VAPID_PRIVATE_KEY` në GitHub, në kodin e shfletuesit ose në chat.

## Aktivizimi në iPhone

1. Hape faqen në Safari.
2. Shtype **Share → Add to Home Screen**.
3. Hape Ndërtimtarinë nga ikona e re në Home Screen dhe hyr si klient.
4. Te paneli i klientit, shtype **Aktivizo njoftimet në telefon** dhe lejo njoftimet.
5. Hyr si admin dhe prano një kërkesë prove. Klienti merr njoftim në telefon edhe kur aplikacioni është mbyllur.

Web Push në iPhone kërkon iOS 16.4 ose më të ri dhe aplikacionin e shtuar në Home Screen.
