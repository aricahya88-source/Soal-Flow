# SoalFlow v2.5 — Instalasi dan Upgrade

Versi 2.5 tidak menambah tabel database. Fitur upload memakai model `ImportJob` dan `ImportRow` yang sudah tersedia pada schema sebelumnya.

## Instalasi lokal baru

```bash
npm run setup
```

Jika `DATABASE_URL` belum diisi, edit `.env`, lalu jalankan:

```bash
npm run setup:db
npm run dev
```

`setup:db` menggunakan `prisma db push`, sehingga juga aman untuk database lokal yang schema-nya sudah terisi dan tidak menimbulkan error P3005.

## Upgrade dari v2.4

Ekstrak paket v2.5 dan pertahankan file `.env` lama, kemudian:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Tidak perlu menjalankan `prisma migrate reset` dan tidak perlu menghapus database.

## Template upload

Template tersedia di folder:

```text
templates/template-upload-kisi-kisi.xlsx
templates/template-upload-soal.xlsx
```

Setelah aplikasi berjalan, Super Admin juga dapat mengunduhnya dari menu **Upload Kisi-kisi & Soal**.

## Port bawaan

```text
Admin   : http://localhost:3000
Peserta : http://localhost:3001
```

Tidak ada konfigurasi untuk port 30001.
