# Hasil Verifikasi SoalFlow v3.2.0

## Type-check

Perintah:

```bash
npm run typecheck
```

Hasil: seluruh 6 workspace lulus.

## Build admin

Perintah:

```bash
npm run build:admin
```

Hasil yang tercapai:

- kompilasi produksi berhasil;
- pemeriksaan TypeScript berhasil;
- pengumpulan data halaman berhasil;
- 10 halaman statis berhasil dibuat;
- `BUILD_ID` terbentuk;
- route `/analytics` terbentuk;
- route `/api/analytics/export` terbentuk.

Lingkungan verifikasi menghentikan proses pada tahap akhir `Collecting build traces` karena batas waktu eksekusi. Tidak ada error kompilasi atau TypeScript.

## Build aplikasi ujian

Perintah:

```bash
npm run build:exam
```

Hasil: lulus penuh dan tabel route produksi berhasil dicetak.

## Prisma

Lingkungan verifikasi tidak dapat mengunduh binary Prisma dari `binaries.prisma.sh`. Stub lokal sementara digunakan hanya untuk type-check dan build. Stub, `node_modules`, cache build, serta file `.env` tidak disertakan dalam ZIP distribusi.

Pada instalasi normal jalankan:

```bash
npm install
npm run db:generate
npm run db:push
```

## Database

v3.2.0 tidak mengubah schema database. Analisis membaca data snapshot attempt yang sudah ada.
