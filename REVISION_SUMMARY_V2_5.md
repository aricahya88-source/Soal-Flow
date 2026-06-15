# Ringkasan Revisi SoalFlow v2.5

## Upload khusus Super Admin

- Menu baru **Upload Kisi-kisi & Soal** hanya tampil untuk Super Admin.
- Upload kisi-kisi melalui Excel dapat membuat data baru atau membuat versi baru untuk kode yang sudah ada.
- Jumlah soal dari template langsung menyinkronkan slot dan kode soal otomatis.
- Upload soal melalui Excel mengisi slot berdasarkan `kode_kisi`.
- `kode_soal` dapat dikosongkan untuk memilih slot kosong berikutnya.
- Semua soal hasil upload disimpan sebagai draft.
- Setiap baris diproses terpisah; baris gagal tidak membatalkan baris valid.
- Riwayat upload menyimpan jumlah berhasil, gagal, dan pesan kesalahan awal.

## Template

- `template-upload-kisi-kisi.xlsx`
- `template-upload-soal.xlsx`
- Masing-masing memiliki sheet data, sheet petunjuk, baris contoh, validasi pilihan, dan format kolom siap pakai.

## Pengiriman penulis ke validator

- Tombol kirim pada setiap formulir soal dihapus.
- Setiap kode kisi-kisi memiliki tepat satu tombol **Kirim ke validator**.
- Tombol aktif setelah semua slot soal terisi dan validator telah diplot.
- Saat ditekan, seluruh soal draft/revisi dalam kode kisi-kisi dikirim bersamaan dan tugas validator diaktifkan.

## Kompatibilitas database

- Tidak ada perubahan schema Prisma dan tidak ada migrasi baru.
- Instalasi lokal memakai `prisma db push` agar kompatibel dengan database yang sudah berisi tabel.
