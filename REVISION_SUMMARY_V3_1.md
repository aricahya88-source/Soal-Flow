# Ringkasan Revisi SoalFlow v3.1.0

## Daftar yang menerima pagination

1. Plotting Tugas — Daftar plotting penulis.
2. Plotting Tugas — Daftar plotting validator.
3. Kisi-kisi — Daftar kisi-kisi.
4. Tulis Soal — Daftar soal.
5. Validasi Soal — Daftar soal yang divalidasi.
6. Buat Paket — Daftar paket.
7. Peserta Ujian — Daftar peserta.
8. Upload Kisi-kisi & Soal — Riwayat upload.
9. User — Daftar user.

## Perilaku pagination

- Bawaan 10 data per halaman.
- Pilihan 10, 20, 30, 50, dan All.
- Data terbaru tampil paling atas.
- Menampilkan rentang data, total data, nomor halaman, tombol Sebelumnya, dan Berikutnya.
- Halaman otomatis dikoreksi jika nomor halaman melebihi jumlah halaman setelah data dihapus.
- Tab plotting penulis dan validator mempertahankan parameter tab saat berpindah halaman.
- Kolom jumlah pada header menampilkan total keseluruhan, bukan hanya isi halaman aktif.

## Kisi-kisi

Tombol **Tambahkan kisi-kisi** dipindahkan ke atas daftar agar penambahan data tetap mudah walaupun daftar memiliki banyak halaman.

## Tulis dan Validasi Soal

Unit pagination adalah soal. Setelah maksimal jumlah soal pada halaman diambil dari database, soal dikelompokkan kembali berdasarkan kode kisi-kisi. Panel acuan kisi-kisi dan stimulus tetap tampil pada setiap kelompok yang muncul di halaman tersebut.

## Database

Tidak ada perubahan schema database.
