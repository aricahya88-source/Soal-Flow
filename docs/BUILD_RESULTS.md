# Hasil Verifikasi Starter

Tanggal verifikasi: 12 Juni 2026

## Berhasil

- `npm install --ignore-scripts --no-audit --no-fund`
- TypeScript workspace: seluruh package aplikasi/UI/renderer/validasi lolos.
- Build produksi aplikasi admin: berhasil.
- Build produksi aplikasi peserta: berhasil.
- Template Excel diperiksa dan tidak memiliki formula error.
- Gambar contoh berukuran sekitar 4 KB dan lolos batas 100 KB.

## Catatan Prisma

`prisma generate` memerlukan unduhan binary Prisma. Pada lingkungan pembuatan ZIP, permintaan binary gagal karena resolusi jaringan sementara. Jalankan perintah berikut pada mesin dengan koneksi internet setelah mengisi `.env`:

```bash
npm run db:generate
```

Setelah client dibuat, jalankan kembali:

```bash
npm run typecheck
npm run build
```
