# Perbaikan localhost:3002 Internal Server Error

Penyebab paling umum setelah revisi `apps/pengawas` adalah Prisma client atau database belum tersinkron dengan schema terbaru. Aplikasi pengawas sekarang membaca tabel/relasi baru:

- `ExamRoom`
- `SupervisorAssignment.roomId`
- `SupervisorIncident`
- `ExamSession.roomId`

## Cara menjalankan ulang

Dari root project:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev:pengawas
```

Pada ZIP ini, script `dev:pengawas` sudah dibuat self-healing:

```bash
npm run db:generate && npm run db:push && npm run dev --workspace=@seleksi/pengawas
```

Jadi setelah install, cukup jalankan:

```bash
npm run dev:pengawas
```

## Perubahan tambahan pada patch ini

1. Dashboard, Monitoring, dan Cetak pada `apps/pengawas` tidak langsung jatuh ke Internal Server Error jika database belum sinkron.
2. Jika schema belum siap, halaman akan menampilkan panel instruksi sinkronisasi.
3. Sorting `room` dan `participant` dipindahkan ke JavaScript agar tidak bergantung pada nested Prisma `orderBy` yang bisa berbeda antar versi client.
