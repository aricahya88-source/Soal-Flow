# Changelog v2.2

## Perubahan utama

- Menyesuaikan form kisi-kisi dengan format Word DP01.
- Menambahkan kode kisi-kisi otomatis `KK-0001`.
- Menambahkan kode soal otomatis berbasis kisi-kisi, misalnya `KK-0001-S01`.
- Menambahkan menu Plotting Tugas.
- Menambahkan model database `QuestionWritingAssignment` untuk plotting kisi-kisi ke penulis soal.
- Menambahkan model database `QuestionValidationAssignment` untuk plotting soal ke validator.
- Menambahkan WYSIWYG pada seluruh isian teks utama.
- Menambahkan dukungan LaTeX, link, gambar dari komputer, gambar dari URL, dan tabel pada editor.
- Menyesuaikan dashboard dan alur kerja ke v2.2.

## Dampak database

Jalankan `npm run setup:db` setelah update. Struktur baru akan ditambahkan melalui Prisma db push.
