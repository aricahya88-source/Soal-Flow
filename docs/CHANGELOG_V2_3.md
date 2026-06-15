# Changelog v2.3

## Fokus rilis

Versi 2.3 dibuat untuk memudahkan instalasi lokal dan deployment dari root project tanpa perlu menambahkan argumen `--schema` pada perintah Prisma.

## Perubahan utama

1. Menambahkan konfigurasi Prisma di root `package.json`:

```json
"prisma": {
  "schema": "packages/database/prisma/schema.prisma"
}
```

2. Menambahkan dependency root:

```json
"dependencies": {
  "@prisma/client": "^6.5.0"
},
"devDependencies": {
  "prisma": "^6.5.0"
}
```

3. Menambahkan migration awal:

```text
packages/database/prisma/migrations/20260612000100_init/migration.sql
```

4. Menambahkan file panduan:

```text
INSTALL_V2_3.md
```

5. Memperbarui `.env.example` agar hanya perlu mengisi variabel utama:

```env
DATABASE_URL=""
AUTH_SECRET=""
BLOB_READ_WRITE_TOKEN=""
```

## Perintah instalasi yang didukung

```bash
npm install
cp .env.example .env
nano .env
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

## Port lokal

```text
Admin Panel : http://localhost:3000
Exam App    : http://localhost:3001
```
