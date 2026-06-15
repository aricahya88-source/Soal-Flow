# Instalasi dan Upgrade SoalFlow v2.6.0

## Instalasi baru

1. Ekstrak ZIP dan masuk ke folder proyek.
2. Jalankan:

```bash
npm run setup
```

3. Jika diminta, isi `DATABASE_URL` di `.env`, lalu jalankan:

```bash
npm run setup:db
npm run dev
```

Setup memakai `prisma db push`, bukan `migrate deploy`, sehingga database lama yang sudah memiliki tabel tidak terkena P3005.

## Upgrade dari v2.5.0

Cadangkan database dan file `.env`, lalu salin `.env` lama ke folder v2.6.0. Jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

`db:push` menambahkan struktur stimulus pada kisi-kisi dan field `questionMode`. Data soal lama tetap menggunakan mode `INDEPENDENT` secara default.

## Menjalankan aplikasi

```bash
npm run dev
```

- Admin: `http://localhost:3000`
- Peserta/demo: `http://localhost:3001`

Tidak ada konfigurasi atau proses yang menggunakan `localhost:30001`.

## Template upload

- `templates/template-upload-kisi-kisi-v2.6.xlsx`
- `templates/template-upload-soal-v2.6.xlsx`

Untuk reading comprehension, upload kisi-kisi/stimulus dahulu, lalu upload pertanyaan.
