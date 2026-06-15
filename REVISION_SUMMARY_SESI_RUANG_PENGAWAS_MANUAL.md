# Revisi Sesi/Ruang & Pengawas Manual

Perubahan utama:

1. Menambahkan model `ExamRoom` untuk ruang ujian.
   - Kode ruang
   - Nama ruang
   - Lokasi
   - Kapasitas
   - Status aktif/nonaktif

2. Memindahkan plotting peserta dari konteks paket ke konteks sesi peserta + ruang ujian.
   - Paket tetap menjadi sumber soal.
   - Peserta diplot pada menu `Sesi Ujian & Ruang`.
   - Sesi memiliki paket, peserta, ruang, waktu mulai-selesai, dan pengawas.

3. Mengubah penugasan pengawas.
   - Pengawas tidak lagi ditugaskan secara umum ke paket.
   - Pengawas ditugaskan ke sesi/ruang melalui `SupervisorAssignment.examSessionId` dan `roomId`.

4. Mengubah pembuatan akun pengawas.
   - Tidak lagi generate otomatis.
   - Admin dapat input manual: username, password, nama, no HP.
   - Nama dan no HP boleh kosong pada import Excel.
   - Template Excel tersedia di `apps/admin/public/templates/template-pengawas.xlsx` dan `templates/template-pengawas.xlsx`.

5. Mengubah dashboard pengawas dan monitoring admin.
   - Monitoring dikelompokkan berdasarkan sesi/ruang.
   - Action tetap: Play, Pause, Resume, Reset Login, Force Logout, Catatan Pelanggaran.
   - Tidak ada Force Submit.
   - Tidak ada Tambah Waktu.

6. Mengubah cetak Berita Acara dan Laporan.
   - Cetak berbasis sesi/ruang.
   - Bagian tanda tangan menggunakan pengawas yang ditugaskan pada sesi/ruang.

7. Merapikan sidebar admin.
   - `Upload Kisi-kisi & Soal`, `User`, dan `Pengaturan` dipindahkan ke atas grup `Operasional Ujian`.

Setelah ekstrak ZIP, jalankan:

```bash
npm install
npm run db:generate
npm run db:push
npm run dev
```

Untuk aplikasi pengawas:

```bash
npm run dev:pengawas
```
