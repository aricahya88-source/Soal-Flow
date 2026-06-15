# Instalasi Cepat Seleksi Platform v2.3

Versi ini sudah memperbaiki konfigurasi Prisma agar perintah dari root project tidak perlu menambahkan `--schema`.

## 1. Masuk folder project

```bash
cd seleksi-platform-v2.3
```

## 2. Install dependency

```bash
npm install
```

Jika ingin mengikuti alur eksplisit, perintah berikut boleh dijalankan juga. Namun pada v2.3, `prisma` dan `@prisma/client` sudah dimasukkan ke `package.json`.

```bash
npm install -D prisma
npm install @prisma/client
```

## 3. Buat file environment

```bash
cp .env.example .env
nano .env
```

Isi minimal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE?schema=public"
AUTH_SECRET="isi-minimal-32-karakter"
BLOB_READ_WRITE_TOKEN=""
```

Contoh lokal PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/seleksi_platform?schema=public"
AUTH_SECRET="secret-local-minimal-32-karakter-123456"
BLOB_READ_WRITE_TOKEN=""
```

Untuk membuat `AUTH_SECRET` otomatis:

```bash
npm run secret
```

## 4. Generate Prisma Client

```bash
npx prisma generate
```

## 5. Jalankan migration database

Untuk database baru atau deployment:

```bash
npx prisma migrate deploy
```

Jika database lokal masih kosong dan `migrate deploy` bermasalah, alternatif cepat:

```bash
npx prisma db push
```

## 6. Seed akun admin

```bash
npm run db:seed
```

Akun default:

```text
Email    : admin@seleksi.id
Password : Admin12345!
```

Bisa diubah melalui `.env` sebelum menjalankan `npm run db:seed`.

## 7. Jalankan aplikasi

```bash
npm run dev
```

Alamat lokal:

```text
Admin Panel : http://localhost:3000
Exam App    : http://localhost:3001
```

## Catatan penting

- Gunakan Node.js minimal versi 20.
- Gunakan `localhost`, bukan `local`.
- Jika port 3000 tidak bisa dibuka, cek apakah sedang dipakai:

```bash
lsof -i :3000
```

Matikan proses yang memakai port tersebut:

```bash
kill -9 PID
```

## Perintah ringkas

```bash
npm install
cp .env.example .env
nano .env
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```
