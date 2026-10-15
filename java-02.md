## 1. Përshkrimi i projektit
BuildConnect është një aplikacion mobil që ndihmon klientët të shohin shërbimet e një kompanie
ndërtimi dhe të dërgojnë kërkesa për shërbime në mënyrë të organizuar.
## 2. Problemi dhe përdoruesit
Klientët shpesh kërkojnë kompani ndërtimi përmes rekomandimeve, rrjeteve sociale ose telefonatave.
Kjo mund ta bëjë të vështirë krahasimin e shërbimeve dhe dërgimin e kërkesave. Përdoruesit kryesorë
janë klientët dhe administratori i kompanisë.
## 3. Qëllimi
Të krijohet një mënyrë e thjeshtë për të parë shërbimet, për të dërguar kërkesë dhe për t'i menaxhuar
kërkesat nga ana e kompanisë.
## 4. Funksionalitetet kryesore
1. Regjistrimi dhe kyçja e klientit.
2. Shfaqja e shërbimeve ndërtimore me përshkrim.
3. Formular për dërgimin e kërkesës për një shërbim.
4. Administratori mund t'i shohë kërkesat dhe të ndryshojë statusin e tyre.
## 5. Rrjedha kryesore e përdoruesit
1. Klienti hap aplikacionin dhe kyçet ose regjistrohet.
2. Shfleton listën e shërbimeve.
3. Zgjedh shërbimin që i nevojitet.
4. Plotëson dhe dërgon kërkesën.
5. Kompania e shqyrton kërkesën dhe kontakton klientin.
## 6. Kufijtë e MVP-së
**Përfshihen:** kyçja/regjistrimi, lista e shërbimeve, dërgimi dhe shikimi i kërkesave.
**Nuk përfshihen në këtë version:** pagesat online, hartat/GPS dhe chat-i brenda aplikacionit.
## 7. Kriteret e pranimit
- [ ] Klienti mund të regjistrohet dhe të kyçet.
- [ ] Lista e shërbimeve shfaqet në aplikacion.
- [ ] Klienti mund të dërgojë kërkesë me përshkrim.
- [ ] Administratori mund t'i shohë kërkesat dhe statusin e tyre.
## 8. Modeli fillestar i të dhënave
- `users (id, full_name, email, phone, password, role)`
- `services (id, service_name, description, price)`
- `requests (id, user_id, service_id, message, status, created_at)`
## 9. Rreziku dhe testimi
**Rreziku:** Klientët mund të mos e kuptojnë menjëherë mënyrën e dërgimit të kërkesës.
**Testimi:** Të provohet prototipi me disa përdorues dhe të vëzhgohet nëse arrijnë të gjejnë një
shërbim dhe të dërgojnë kërkesë pa ndihmë.
## 10. Skica
Skica shoqëruese paraqet ekranin kryesor të BuildConnect me navigim, shërbime dhe buton për kërkesë.
