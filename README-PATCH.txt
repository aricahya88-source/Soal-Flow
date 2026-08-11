SOALFLOW — PATCH EXPORT PDF RAPI + NAMA PENULIS/VALIDATOR

Patch ini KUMULATIF dan sudah mencakup:
- Menu Export Soal untuk Penulis Soal dan Validator.
- Pembatasan export hanya pada soal yang ditugaskan kepada user terkait.
- PDF lebih rapi: header/footer konsisten, page-break lebih baik, opsi A-E hanging indent, gambar dipusatkan.
- Metadata kisi-kisi tidak diulang pada setiap soal.
- Stimulus yang sama pada satu kelompok tidak dicetak berulang pada setiap soal.
- Nama Penulis Soal dan Validator ditampilkan pada PDF.
- Nama Penulis Soal dan Validator ditambahkan pada export Excel standar (Data Soal HTML dan Versi Teks).
- Beberapa simbol matematika umum tidak lagi hilang; dikonversi ke representasi ASCII yang aman untuk renderer PDF saat ini.

UNTUK GITHUB WEB (disarankan jika Anda biasa drag & drop):
1. Ekstrak ZIP ini.
2. Upload/ganti 4 file di folder apps/... ke lokasi yang sama di repository Anda.
3. Commit perubahan.

UNTUK GIT LOKAL dari baseline project ZIP awal:
  git apply soalflow-export-pdf-rapi.patch

Catatan:
- File .patch dibuat terhadap baseline ZIP awal yang Anda kirim. Jika patch sebelumnya sudah diterapkan, lebih aman gunakan file source di folder apps/... dalam paket ini (overwrite file yang sama), bukan git apply patch kumulatif.

File yang berubah:
- apps/admin/components/admin-shell-client.tsx
- apps/admin/app/question-exports/page.tsx
- apps/admin/app/api/question-exports/route.ts
- apps/admin/lib/question-export-access.ts
