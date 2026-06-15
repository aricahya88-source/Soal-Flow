# Revisi Operasional Ujian

Revisi ini menambahkan modul Operasional Ujian pada aplikasi admin SoalFlow.

## Menu baru

- Peserta Ujian
- Pengawas
- Sesi Ujian
- Monitoring Ujian
- Cetak BA & Laporan

## Perubahan peserta

- Form peserta kini menggunakan username/nomor peserta.
- Password awal memakai tanggal lahir format DDMMYYYY.
- Data peserta ditambah NIK dan link foto.
- Upload peserta melalui Excel tersedia pada `/participants`.
- Template tersedia pada `/templates/template-peserta-ujian.xlsx` dan `templates/template-peserta-ujian.xlsx`.

## Pengawas

- Akun pengawas digenerate otomatis tanpa input nama asli.
- Format kode: `PGW-0001`.
- Format username: `pgw_0001`.
- Login pengawas dapat memakai username atau email internal `pgw_0001@pengawas.local`.
- Role baru: `EXAM_SUPERVISOR`.

## Sesi dan monitoring

- `ExamSession` memiliki status `WAITING`, `ACTIVE`, `PAUSED`, `CLOSED`.
- Pengawas/admin dapat Play, Pause, Resume sesi.
- Pengawas/admin dapat Pause/Resume peserta.
- Reset Login dan Force Logout hanya mencabut session login peserta, tidak menghapus attempt atau jawaban.
- Catatan pelanggaran disimpan pada `SupervisorIncident` dan juga dicatat sebagai security event jika peserta sudah memiliki attempt.
- Jawaban tetap memakai autosave yang sudah ada pada endpoint answer exam.

## Cetak

- Menu Cetak BA & Laporan menampilkan berita acara dan laporan monitoring.
- Bagian bawah dokumen memiliki area TTD Pengawas.

## Catatan setelah deploy

Jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Jika database lama sudah berjalan, `db:push` akan menambahkan field/model baru sesuai schema Prisma.
