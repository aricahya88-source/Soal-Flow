# SoalFlow v2.4 — Instalasi Lokal Mudah

Versi ini tidak menambah tabel database baru. Struktur lama tetap kompatibel dan data plotting validator lama otomatis disesuaikan menjadi plotting per kode kisi-kisi saat aplikasi dibuka.

## Cara paling mudah

1. Pastikan Node.js 20+ dan PostgreSQL sudah tersedia.
2. Ekstrak paket, lalu buka terminal pada folder proyek.
3. Jalankan:

```bash
npm run setup
```

Perintah tersebut memasang dependency, membuat `.env` dan `AUTH_SECRET` bila belum ada, menyinkronkan database, serta membuat akun super admin.

Apabila `DATABASE_URL` belum diisi, proses akan berhenti dengan aman. Isi `.env`, lalu jalankan:

```bash
npm run setup:db
npm run dev
```

## Alternatif Linux/macOS

```bash
chmod +x install-local.sh
./install-local.sh
```

## Perbaikan database lokal lama

```bash
npm run repair:db
npm run dev
```

## Login awal

```text
Email    : admin@seleksi.id
Password : Admin12345!
```

Nilai tersebut dapat diganti melalui `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_NAME` di `.env` sebelum menjalankan seed.

## Port bawaan proyek

```text
Admin   : http://localhost:3000
Peserta : http://localhost:3001
```

Tidak ada konfigurasi atau proses yang dibuat untuk port `30001` pada revisi ini.
