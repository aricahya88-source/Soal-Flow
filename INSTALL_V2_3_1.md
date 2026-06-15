# Seleksi Platform v2.3.1 — Instalasi Lokal Mudah

Versi ini dibuat untuk mencegah error tabel hilang seperti:

```text
The table `public.QuestionWritingAssignment` does not exist in the current database.
```

Penyebab error tersebut biasanya database masih memakai struktur versi lama, sedangkan aplikasi sudah memakai schema Prisma baru.

## Cara install dari awal

```bash
npm install
cp .env.example .env
nano .env
```

Isi minimal:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/NAMA_DATABASE?schema=public"
AUTH_SECRET="isi-random-secret-minimal-32-karakter"
BLOB_READ_WRITE_TOKEN=""
```

Lalu jalankan:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Kenapa memakai `db push` untuk lokal?

Untuk instalasi lokal atau database yang pernah dipakai versi sebelumnya, `prisma db push` lebih praktis karena langsung menyinkronkan tabel dari `schema.prisma` ke database.

`prisma migrate deploy` cocok untuk production atau database yang benar-benar mengikuti riwayat migration dari awal.

## Perintah perbaikan jika muncul tabel hilang

Jalankan:

```bash
npm run repair:db
npm run dev
```

Perintah itu akan menjalankan:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## Akses aplikasi

```text
Admin Panel : http://localhost:3000
Exam App    : http://localhost:3001
```

## Login default

```text
Email    : admin@seleksi.id
Password : Admin12345!
```

Bisa diubah melalui `.env` sebelum menjalankan `npm run db:seed`:

```env
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
ADMIN_NAME="Super Admin"
```

## Jika tetap ingin memakai migrate deploy

Untuk database bersih:

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev:fast
```

Untuk database lokal yang sudah pernah dipakai versi lama, lebih aman pakai:

```bash
npm run repair:db
npm run dev
```
