# \# Ndërtimtari — Java 5 · Hyrja dhe lejet

# 

# \## Çfarë ndërtova

# 

# Në këtë javë implementova hyrjen dhe daljen me GitHub, profilin e përdoruesit dhe kontrollin e lejeve në aplikacionin Ndërtimtari. Identiteti tregon kush është përdoruesi, roli përcakton veprimet që lejohen dhe pronësia përcakton cilën kërkesë për ofertë mund ta ndryshojë përdoruesi.

# 

# \## Provat që bëra

# 

# \### Prova 1: Hyrja, rifreskimi dhe dalja

# 

# \*\*Hapat:\*\* Hapa faqen `/panel` pa hyrë në llogari, u kyça me GitHub, rifreskova faqen dhe pastaj dola nga llogaria.

# 

# \*\*Rezultati:\*\* Para hyrjes u shfaq kërkesa për t'u kyçur me GitHub. Pas hyrjes dhe rifreskimit u shfaq profili i përdoruesit. Pas daljes, për të vazhduar në panel kërkohej përsëri hyrja.

# 

# \### Prova 2: Krijimi dhe ndryshimi i kërkesës për ofertë

# 

# \*\*Hapat:\*\* U kyça me GitHub, zgjodha projektin “Ndërtim shtëpie”, plotësova mesazhin dhe dërgova kërkesën. Pastaj e ndryshova mesazhin dhe ruajta ndryshimet.

# 

# \*\*Rezultati:\*\* Kërkesa u ruajt në databazën Neon dhe u shfaq në panel. Pas ndryshimit, mesazhi i përditësuar u shfaq në kërkesën time.

# 

# \### Prova 3: Refuzimi i veprimit pa leje

# 

# \*\*Hapat:\*\* Kontrollova funksionin e ndryshimit të kërkesës, i cili kërkon që ID-ja e kërkesës dhe identifikuesi GitHub i përdoruesit të përputhen me kërkesën që po ndryshohet.

# 

# \*\*Rezultati:\*\* Kodi e refuzon ndryshimin kur kërkesa nuk i përket përdoruesit të kyçur. Ky kontroll realizohet përmes kushtit `WHERE id = ... AND github\_id = ...` në databazën Neon.

# 

# \## Ku gjendet puna

# 

# Repository: https://github.com/valmirasllamniku-bot/rideshare-mobile

# 

# Skedarët e Java 5 përfshijnë `src/lib/auth.ts`, `src/lib/lejet.ts`, `src/lib/db.ts`, rrugën e autentikimit me GitHub dhe faqen e panelit.

# 

# \## Çfarë mbetet për përmirësim

# 

# Në të ardhmen do të shtoja menaxhimin e ofertave nga administratori, statuset e kërkesave dhe njoftimet për klientët.

# 

# \## Ndihma nga AI

# 

# Përdora AI për të kuptuar udhëzimet, për të zhvilluar kodin dhe për të dokumentuar provat e projektit.

