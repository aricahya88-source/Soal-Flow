# Changelog v2.0

## Fokus rilis

Versi 2.0 memprioritaskan kemudahan instalasi dan pengurangan langkah manual yang sering menimbulkan error.

## Perubahan instalasi

- Menambahkan `npm run setup` untuk setup otomatis awal.
- Menambahkan `npm run setup:db` sebagai satu perintah database: generate Prisma Client, push schema, dan seed admin.
- Menambahkan `npm run secret` untuk membuat `AUTH_SECRET`.
- Menambahkan `npm run clean` untuk membersihkan cache instalasi.
- Menambahkan `npm run dev:admin` dan `npm run dev:exam` jika hanya ingin menjalankan salah satu aplikasi.
- Root script Prisma sekarang memakai `--schema packages/database/prisma/schema.prisma`, sehingga `.env` di root project lebih mudah terbaca.

## Perubahan environment

- `.env.example` dibuat lebih sederhana.
- `DATABASE_URL` tetap wajib.
- `AUTH_SECRET` tetap wajib, tetapi dapat dibuat otomatis oleh `npm run setup`.
- `DIRECT_URL` dihapus dari schema agar instalasi awal tidak memerlukan dua connection string.
- `BLOB_READ_WRITE_TOKEN` dan `NEXT_PUBLIC_APP_URL` ditambahkan sesuai kebutuhan deployment modern, tetapi token blob boleh dikosongkan dulu.

## Catatan database

- Untuk instalasi pertama, gunakan `npm run setup:db`.
- `npx prisma migrate deploy` tidak direkomendasikan untuk setup awal starter karena folder migration belum menjadi sumber utama.
- Untuk pengembangan fitur produksi jangka panjang, buat migration terkontrol dengan `npm run db:migrate`.
