# Deploy Seleksi Platform v2.2 ke Vercel

## 1. Siapkan database PostgreSQL

Gunakan Neon, Supabase, Railway, atau PostgreSQL lain. Salin connection string ke variabel `DATABASE_URL`.

## 2. Push project ke GitHub

```bash
cd seleksi-platform-v2.2
git init
git add .
git commit -m "release v2.2"
git branch -M main
git remote add origin <URL_REPOSITORY_ANDA>
git push -u origin main
```

## 3. Import project di Vercel

Pilih repository GitHub lalu atur konfigurasi berikut:

```text
Root Directory: apps/admin
Install Command: cd ../.. && npm install
Build Command: cd ../.. && npm run vercel-build:admin
Development Command: cd ../.. && npm run dev:admin
```

## 4. Tambahkan Environment Variables

Tambahkan pada menu Settings → Environment Variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="isi_dengan_secret_panjang"
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
ADMIN_NAME="Super Admin"
NEXT_PUBLIC_APP_URL="https://domain-vercel-anda.vercel.app"
```

Buat `AUTH_SECRET` lokal dengan:

```bash
npm run secret
```

## 5. Setup database

Setelah deploy pertama, jalankan dari terminal lokal yang sudah memakai `.env` production:

```bash
npm run setup:db
```

Atau jalankan dari Vercel build jika database sudah siap dengan:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

## 6. Login awal

Masuk ke URL Vercel menggunakan:

```text
Email: sesuai ADMIN_EMAIL
Password: sesuai ADMIN_PASSWORD
```

## 7. Urutan penggunaan v2.2

1. Super admin membuat user dan role.
2. Penulis kisi-kisi membuat kisi-kisi format PMB.
3. Admin/super admin membuka menu Plotting Tugas dan memplot penulis soal berdasarkan kode kisi-kisi.
4. Penulis soal membuat soal berdasarkan tugasnya.
5. Admin/super admin memplot soal kepada validator.
6. Validator mengedit/memvalidasi soal.
7. Admin memasukkan soal APPROVED ke Paket Diujikan.
