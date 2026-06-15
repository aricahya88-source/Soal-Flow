# Instalasi dan Upgrade SoalFlow v3.2.0

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

## Upgrade dari v3.1.0

Backup database terlebih dahulu, kemudian jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

v3.2.0 tidak menambahkan tabel atau kolom database baru. Nilai dan parameter soal dihitung dari snapshot attempt peserta yang sudah tersimpan.

## Menggunakan Nilai & Parameter Soal

1. Masuk sebagai **Admin Ujian** atau **Super Admin**.
2. Buka menu **Nilai & Parameter Soal**.
3. Pilih paket ujian.
4. Sistem menganalisis attempt final berstatus `SUBMITTED` atau `EXPIRED`.
5. Tekan **Unduh Excel** untuk mendapatkan file dengan sheet:
   - Ringkasan
   - Nilai Peserta
   - Parameter Soal
   - Fungsi Pengecoh
   - Reliabilitas

Untuk paket yang memakai random satu soal, nilai N pada setiap butir adalah jumlah peserta yang benar-benar menerima butir tersebut.
