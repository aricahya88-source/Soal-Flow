# INSTALL CEPAT — Seleksi Platform v2.2 Schema Fixed

Versi ini sudah ditambahkan konfigurasi Prisma di `package.json`:

```json
"prisma": {
  "schema": "packages/database/prisma/schema.prisma"
}
```

Dengan ini, perintah Prisma dari root project tidak lagi error `Could not find Prisma Schema`.

## 1. Masuk folder project

```bash
cd seleksi-platform-v2.2-schema-fixed
```

## 2. Buat file environment

```bash
cp .env.example .env
```

Edit `.env`, pastikan bagian ini sesuai database PostgreSQL kamu:

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/seleksi_platform?schema=public"
```

## 3. Install dependency

```bash
npm install --legacy-peer-deps
```

## 4. Generate Prisma Client

Bisa pakai perintah biasa:

```bash
npx prisma generate
```

Atau pakai script bawaan:

```bash
npm run db:generate
```

## 5. Buat/sinkronkan tabel database

Untuk instalasi lokal yang mudah, gunakan:

```bash
npm run db:push
```

Atau jika ingin mode migration:

```bash
npm run db:migrate
```

## 6. Seed admin awal

```bash
npm run db:seed
```

## 7. Jalankan admin

```bash
npm run dev:admin
```

Admin biasanya berjalan di:

```text
http://localhost:3000
```

## Catatan penting

Jika kamu menjalankan perintah ini:

```bash
npx prisma migrate dev
```

Sekarang seharusnya Prisma membaca schema dari:

```text
packages/database/prisma/schema.prisma
```

karena path schema sudah ditambahkan di `package.json`.
