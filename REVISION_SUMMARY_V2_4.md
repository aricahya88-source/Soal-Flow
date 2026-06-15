# Ringkasan Revisi SoalFlow v2.4.0

## Perubahan utama

1. Logo aplikasi dan favicon SVG baru.
2. Plotting validator memakai kode kisi-kisi dan mencakup seluruh slot soal di dalamnya.
3. Plotting tugas dipisahkan menjadi submenu penulis dan validator.
4. Daftar kisi-kisi tampil terlebih dahulu; kolom dapat disembunyikan atau ditampilkan.
5. Form tambah kisi-kisi baru muncul setelah tombol Tambahkan kisi-kisi dibuka.
6. Jumlah soal pada kisi-kisi otomatis membuat slot serta kode soal.
7. Daftar soal tampil di atas dan dikelompokkan berdasarkan kisi-kisi; slot kosong memiliki tombol Buat.
8. Panel Alur v2.2 pada dashboard dihapus.
9. Dashboard didesain ulang dengan ringkasan progres, aktivitas terbaru, dan akses cepat.

## Perbaikan plotting validator

Versi lama hanya menampilkan pilihan soal berstatus SUBMITTED, IN_REVIEW, atau REVISION_REQUIRED. Hal ini membuat daftar kosong ketika soal belum memenuhi filter tersebut.

Versi 2.4 tidak lagi memilih satu soal dari filter itu. Admin memilih kode kisi-kisi, kemudian sistem membuat atau memperbarui penugasan validator untuk seluruh slot soal. Soal yang telah dikirim penulis otomatis muncul pada menu Validasi Soal milik validator terkait.

## Kompatibilitas data lama

Tidak ada tabel database baru. Saat halaman terkait dibuka, sistem:

- memastikan jumlah slot soal sesuai target kisi-kisi;
- mempertahankan soal lama yang sudah berisi;
- memperluas plotting validator lama ke seluruh slot pada kode kisi-kisi yang sama.

## Validasi proyek

- TypeScript type-check admin: lulus.
- Next.js production build: lulus.
- Server lokal dan port 30001 tidak dijalankan atau dibuat.
