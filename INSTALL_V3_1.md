# Instalasi dan Upgrade SoalFlow v3.1.0

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

## Upgrade dari v3.0.0

Backup database terlebih dahulu, kemudian jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

v3.1.0 tidak menambahkan tabel atau kolom database baru. Pagination dijalankan pada query aplikasi dan parameter URL.

## Penggunaan pagination

Setiap daftar dimulai dengan 10 data. Pilih salah satu:

- 10
- 20
- 30
- 50
- All

Tekan **Terapkan** setelah mengubah jumlah tampilan. Parameter disimpan di URL, contohnya:

```text
/blueprints?page=2&size=20
/questions?page=1&size=10
```

Data terbaru ditampilkan lebih dahulu. Pada Tulis Soal dan Validasi Soal, soal pada halaman aktif tetap dikelompokkan menurut kode kisi-kisi agar panel acuan dan stimulus tetap tersedia.
