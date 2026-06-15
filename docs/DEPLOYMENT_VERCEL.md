# Deployment v2.2 ke Vercel

Project ini memakai monorepo dengan aplikasi admin pada `apps/admin`. Gunakan konfigurasi berikut di Vercel:

```text
Root Directory: apps/admin
Install Command: cd ../.. && npm install
Build Command: cd ../.. && npm run vercel-build:admin
Development Command: cd ../.. && npm run dev:admin
```

Environment variables wajib:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="secret_panjang"
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
ADMIN_NAME="Super Admin"
NEXT_PUBLIC_APP_URL="https://domain-vercel-anda.vercel.app"
```

Setelah deploy, jalankan setup database:

```bash
npm run setup:db
```

Untuk perubahan produksi yang lebih ketat, buat migrasi Prisma terlebih dahulu di lokal, lalu gunakan `npm run db:deploy`.
