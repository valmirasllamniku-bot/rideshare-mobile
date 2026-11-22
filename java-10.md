# Java 10 – Dy ekrane, një gjendje

## Çfarë u ndërtua

- Kërkesa e klientit ruhet në Neon përmes veprimit në server. Formulari i projektit nuk përdor më `localStorage` si ruajtje kryesore.
- Administratori i lexon kërkesat e veta të autorizuara nga serveri dhe i rifreskon automatikisht çdo 5 sekonda.
- Klienti lexon vetëm kërkesën e llogarisë së vet. Paneli i klientit rifreskon statusin dhe numrin e vendeve çdo 5 sekonda.
- Faqja e projektit e rilexon numrin e vendeve nga Neon çdo 5 sekonda.
- Pranimi e ndryshon statusin dhe ul vendet në të njëjtën pyetje të databazës. Një kërkesë e pranuar më parë nuk pranohet përsëri; ulja e vendeve kërkon që numri të jetë mbi zero.
- Gjatë ndërprerjes, pamja e fundit ruhet dhe shfaqet njoftimi i rilidhjes. Formulari i klientit dhe pranimi i administratorit bllokohen offline.

## Skedarët kryesorë

- `aplikacioni/src/app/projekti/[id]/kerkesa/page.tsx`
- `aplikacioni/src/app/api/kerkesat/route.ts`
- `aplikacioni/src/app/api/kerkesat/ime/route.ts`
- `aplikacioni/src/app/api/projektet/route.ts`
- `aplikacioni/src/components/FormaKerkese.tsx`
- `aplikacioni/src/components/KerkesatAdmin.tsx`
- `aplikacioni/src/components/GjendjaKerkesesLive.tsx`
- `aplikacioni/src/components/VendetLive.tsx`

## Kontrollet teknike

- `npx tsc --noEmit` nga `aplikacioni/`: kaloi.
- ESLint për skedarët e ndryshuar: kaloi.
- `npm run lint` për gjithë aplikacionin: kaloi.
- `npx tsc --noEmit`: kaloi.
- `npm run build`: kaloi. U hoq ngarkimi i dy fonteve Google që nuk përdoreshin nga CSS-i, për të shmangur varësinë e build-it nga interneti. Next.js shfaqi vetëm paralajmërimin ekzistues se ka dy `package-lock.json` dhe zgjodhi rrënjën e repository-t.

## Provat në dy sesione

Nuk u kryen në këtë sesion me dy llogari të kyçura dhe databazën aktive. Prandaj rezultatet e mëposhtme nuk raportohen si të provuara.

| Rasti | Çfarë duhet vërejtur | Rezultati real |
|---|---|---|
| 1 – Kërkesa | Klienti dërgon kërkesën; pa Refresh, ajo shfaqet te administratori si në pritje. Vendet nuk ndryshojnë. | Nuk u ekzekutua këtu. |
| 2 – Pranimi | Administratori e pranon; të dy ekranet tregojnë statusin e pranuar dhe një vend më pak. Përsëritja nuk e ul numrin përsëri. | Nuk u ekzekutua këtu. |
| 3 – Offline/rilidhje | Klienti offline ruan pamjen e fundit dhe tregon paralajmërimin. Pas rilidhjes, leximi automatik sjell statusin dhe vendet e reja. | Nuk u ekzekutua këtu. |

Për dorëzim të plotë, ekzekuto tri rastet me dy sesione të ndara dhe zëvendëso secilin rezultat me vëzhgimin real. Mos i raporto si sukses nëse nuk u provuan.
