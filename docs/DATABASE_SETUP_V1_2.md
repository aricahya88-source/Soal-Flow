# Panduan Database & Login — Versi 1.2

Dokumen ini menjelaskan cara membuat database PostgreSQL, menghubungkan Prisma, dan membuat akun admin awal untuk fitur login.

## 1. Buat database PostgreSQL

Anda dapat memakai PostgreSQL lokal, Supabase, Neon, Railway, atau penyedia PostgreSQL lain. Nama database bebas, contoh: `seleksi_platform`.

### Opsi A — PostgreSQL lokal

1. Install PostgreSQL.
2. Buat database baru:

```sql
CREATE DATABASE seleksi_platform;
```

3. Contoh koneksi lokal:

```env
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/seleksi_platform"
DIRECT_URL="postgresql://postgres:password_anda@localhost:5432/seleksi_platform"
```

### Opsi B — Supabase / Neon / Railway

1. Buat project PostgreSQL baru.
2. Salin connection string dari dashboard penyedia.
3. Isi `DATABASE_URL` dan `DIRECT_URL` di file `.env`.
4. Untuk Supabase/Neon yang memakai pooler, `DATABASE_URL` boleh memakai pooler, sedangkan `DIRECT_URL` sebaiknya memakai direct connection.

## 2. Siapkan file `.env`

Duplikasi file contoh:

```bash
cp .env.example .env
```

Isi minimal variabel berikut:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="isi-dengan-random-secret-minimal-32-karakter"
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
ADMIN_NAME="Super Admin"
```

Buat `AUTH_SECRET` dengan perintah berikut:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Install dependency dan generate Prisma Client

```bash
npm install
npm run db:generate
```

## 4. Buat tabel database

Untuk development paling mudah gunakan:

```bash
npm run db:push
```

Jika Anda ingin memakai migration history:

```bash
npm run db:migrate
```

## 5. Buat akun admin awal

```bash
npm run db:seed
```

Akun default mengikuti `.env`:

- Email: `ADMIN_EMAIL`
- Password: `ADMIN_PASSWORD`

Default dari `.env.example` adalah:

- Email: `admin@seleksi.id`
- Password: `Admin12345!`

Setelah login pertama, sebaiknya ganti password lewat fitur manajemen akun lanjutan atau ubah `ADMIN_PASSWORD`, lalu jalankan ulang `npm run db:seed` untuk memperbarui hash password admin.

## 6. Jalankan aplikasi

```bash
npm run dev
```

Buka dashboard admin:

```text
http://localhost:3000/login
```

## Perubahan schema auth versi 1.2

Pada `packages/database/prisma/schema.prisma`, versi ini menambahkan:

- `User.passwordHash` untuk menyimpan hash password.
- `User.lastLoginAt` untuk mencatat waktu login terakhir.
- `UserSession` untuk menyimpan sesi login aktif, waktu kedaluwarsa, user agent, dan IP.

Password tidak disimpan dalam bentuk teks biasa. Sistem memakai PBKDF2 SHA-256 dengan salt acak dan cookie sesi `httpOnly`.
