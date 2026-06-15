# Instalasi dan Upgrade SoalFlow v2.7.0

## Kebutuhan

- Node.js 20 atau lebih baru
- PostgreSQL
- npm 10 atau lebih baru

## Instalasi baru

Dari folder proyek:

```bash
npm run setup
```

Apabila `DATABASE_URL` belum diisi, edit `.env`:

```bash
nano .env
```

Contoh:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/seleksi_platform?schema=public"
AUTH_SECRET="ganti-dengan-secret-minimal-32-karakter"
```

Kemudian jalankan:

```bash
npm run setup:db
npm run dev
```

Alamat aplikasi:

- Admin: `http://localhost:3000`
- Peserta: `http://localhost:3001`

## Upgrade dari v2.6.0

Backup database terlebih dahulu. Setelah mengganti folder aplikasi dengan v2.7.0, jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Versi ini menggunakan `prisma db push` untuk memperbarui schema database lama tanpa menjalankan ulang migrasi awal yang dapat memicu P3005.

## Urutan penggunaan

1. Pastikan kisi-kisi, stimulus, dan soal sudah berstatus `APPROVED`.
2. Buka **Buat Paket**.
3. Isi bidang yang diuji, kode paket, nama, jadwal WIB, dan durasi.
4. Pilih kode kisi-kisi.
5. Pada setiap kode, pilih **Random pilih 1 soal** atau **Ujikan semua soal**.
6. Simpan paket dan ubah status menjadi `PUBLISHED` saat siap.
7. Tambahkan akun melalui **Peserta Ujian**. Username boleh angka atau teks dan tidak membutuhkan email.
8. Buka kembali paket lalu gunakan **Plot peserta**.
9. Peserta login melalui port `3001`.

## Catatan keamanan ujian

Aplikasi peserta menerapkan layar penuh, watermark identitas, blok salin/cetak/klik kanan/shortcut tertentu, deteksi perpindahan tab, dan pencatatan keluar dari layar penuh. Ini adalah lapisan pencegahan dan audit. Browser tidak dapat menjamin pemblokiran screenshot sistem operasi, kamera eksternal, atau perangkat lain secara mutlak.
