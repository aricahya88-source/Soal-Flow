# Ringkasan Revisi SoalFlow v3.0.0

## 1. Konsistensi tabel utama

- Tabel Kisi-kisi, Tulis Soal, dan Validasi Soal tidak menggunakan nomor urut.
- Urutan data tetap ditentukan oleh kode kisi-kisi dan kode soal.
- Label kolom Tulis Soal dan Validasi Soal diseragamkan menjadi `Kode soal`, `Isi soal`, status/penanggung jawab, dan `Aksi`.

## 2. Kolom kode selalu terlihat

- Kolom `Kode` pada Kisi-kisi dikunci.
- Kolom `Kode soal` pada Tulis Soal dan Validasi Soal dikunci.
- Komponen pengaturan kolom memfilter kembali data `localStorage`, sehingga preferensi versi lama tidak dapat menyembunyikan kode.

## 3. Acuan kisi-kisi pada Tulis Soal

Di atas kontrol kolom ditampilkan tabel:

- Kelompok Uji
- Topik Uji
- Indikator
- Materi Uji
- Kisi-Kisi

Panel dapat disembunyikan atau ditampilkan secara mandiri. Reading text/stimulus tetap ditampilkan melalui panel stimulus yang sudah tersedia.

## 4. Acuan kisi-kisi pada Validasi Soal

Validator memperoleh konteks kisi-kisi yang sama sebelum membaca tabel soal. Ini menjaga proses validasi tetap mengacu pada indikator, materi, dan rumusan kisi-kisi, bukan hanya melihat isi pertanyaan.

## 5. Database dan kompatibilitas

- Tidak ada migrasi database baru.
- Paket, bidang, peserta, stimulus, soal, dan attempt dari v2.9.0 tetap kompatibel.
