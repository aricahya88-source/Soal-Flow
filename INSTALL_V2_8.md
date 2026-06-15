# Instalasi dan Upgrade SoalFlow v2.8.0

## Kebutuhan

- Node.js 20 atau lebih baru
- PostgreSQL
- npm 10 atau lebih baru

## Instalasi baru

Dari folder proyek:

```bash
npm run setup
```

Apabila `DATABASE_URL` belum diisi, edit `.env`, kemudian jalankan:

```bash
npm run setup:db
npm run dev
```

Alamat aplikasi:

- Admin: `http://localhost:3000`
- Peserta: `http://localhost:3001`

## Upgrade dari v2.7.0

Versi 2.8.0 tidak menambahkan tabel atau kolom database baru. Backup database tetap disarankan sebelum upgrade.

Setelah mengganti folder aplikasi dengan v2.8.0, jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

`db:push` aman digunakan untuk menyelaraskan schema dan tidak menjalankan kembali migrasi awal yang dapat memicu P3005.

## Pengujian akses role

Gunakan akun dengan role berbeda dan coba alamat berikut secara langsung:

- Penulis soal: `/questions`
- Validator soal: `/reviews`
- Penulis kisi-kisi: `/blueprints`
- Admin ujian: `/assignments`, `/packages`, `/participants`
- Super Admin: `/imports`, `/users`, `/settings`

Pengguna tanpa role yang sesuai akan diarahkan kembali ke dashboard. Pemeriksaan juga dilakukan pada Server Action, sehingga menyembunyikan menu bukan satu-satunya lapisan keamanan.

## Catatan tampilan

- Tabel Tulis Soal dan Validasi Soal memiliki tombol hide/unhide kolom.
- Pilihan kolom disimpan pada browser.
- Sidebar memiliki area scroll tersendiri; profil dan tombol keluar tetap berada di bawah.
