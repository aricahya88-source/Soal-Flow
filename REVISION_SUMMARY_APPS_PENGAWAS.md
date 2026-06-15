# Ringkasan Revisi — Aplikasi Pengawas Terpisah

## Tujuan
Menambahkan aplikasi/domain khusus pengawas agar akun pengawas tidak perlu masuk ke Admin Panel. Admin tetap mengelola peserta, pengawas, sesi, dan paket ujian; pengawas hanya menjalankan monitoring pelaksanaan ujian.

## Aplikasi Baru

```text
apps/pengawas → localhost:3002
```

Script baru pada root `package.json`:

```bash
npm run dev:pengawas
npm run build:pengawas
npm run vercel-build:pengawas
```

Environment baru:

```env
NEXT_PUBLIC_PENGAWAS_URL="http://localhost:3002"
```

## Menu Aplikasi Pengawas

1. Dashboard
   - Ringkasan paket/sesi yang ditugaskan.
   - Jumlah peserta, sedang mengerjakan, menunggu mulai, submit, dan catatan/insiden.

2. Monitoring Ujian
   - Play / Mulai sesi.
   - Pause sesi.
   - Resume sesi.
   - Pause peserta.
   - Resume peserta.
   - Reset Login peserta.
   - Force Logout peserta.
   - Catatan pelanggaran/kejadian.

3. Cetak BA & Laporan
   - Berita Acara Pelaksanaan Ujian.
   - Laporan Monitoring Ujian.
   - Area TTD Pengawas di bagian bawah dokumen.

## Fitur yang Sengaja Tidak Ada di Pengawas

```text
Force Submit Peserta
Tambah Waktu
```

Keduanya tidak diberikan kepada pengawas untuk mengurangi risiko salah klik dan menjaga validitas ujian.

## Keamanan Akses

- Aplikasi pengawas memakai cookie sesi sendiri: `seleksi_pengawas_session`.
- Login pengawas menerima username seperti `pgw_0001`, lalu sistem mencari akun `pgw_0001@pengawas.local`.
- Akun yang boleh masuk aplikasi pengawas:
  - `EXAM_SUPERVISOR`
  - `EXAM_ADMIN`
  - `SUPER_ADMIN`
- Pengawas biasa hanya melihat paket/sesi yang ditugaskan melalui `SupervisorAssignment`.

## Pembagian Aplikasi

```text
apps/admin    → localhost:3000 → kelola peserta, pengawas, sesi, paket, admin monitoring
apps/exam     → localhost:3001 → peserta ujian
apps/pengawas → localhost:3002 → dashboard/monitoring khusus pengawas
```

## Catatan Teknis

- Root `package-lock.json` sudah diperbarui agar workspace `apps/pengawas` dikenali.
- Admin login akan mengarahkan akun yang hanya memiliki role `EXAM_SUPERVISOR` ke `NEXT_PUBLIC_PENGAWAS_URL`.
- Menu Monitoring dan Cetak di Admin Panel tidak lagi ditampilkan untuk akun pengawas biasa.
