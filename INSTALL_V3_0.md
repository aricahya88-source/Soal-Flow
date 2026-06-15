# Instalasi dan Upgrade SoalFlow v3.0.0

## Kebutuhan

- Node.js 20 atau lebih baru
- PostgreSQL
- npm 10 atau lebih baru

## Instalasi baru

Dari folder proyek:

```bash
npm run setup
```

Apabila `DATABASE_URL` belum diisi, edit `.env`, lalu jalankan:

```bash
npm run setup:db
npm run dev
```

Alamat aplikasi:

- Admin: `http://localhost:3000`
- Peserta: `http://localhost:3001`

## Upgrade dari v2.9.0

Backup database terlebih dahulu, kemudian dari folder v3.0.0 jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

v3.0.0 tidak menambahkan tabel atau kolom database baru. `db:push` tetap aman digunakan untuk menyelaraskan schema proyek dan mempertahankan struktur multi-bidang dari v2.9.0.

## Catatan tampilan tabel

- Tidak ada nomor urut pada tabel Kisi-kisi, Tulis Soal, dan Validasi Soal.
- Kolom kode dikunci dan selalu terlihat.
- Panel **Acuan kisi-kisi** pada Tulis Soal dan Validasi Soal dapat dilipat melalui tombol Tampilkan/Sembunyikan.
- Pilihan hide/unhide kolom lain tetap disimpan di browser.
