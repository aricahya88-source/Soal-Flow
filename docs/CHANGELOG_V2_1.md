# Changelog v2.1

## Fokus pembaruan

Versi 2.1 menyesuaikan aplikasi dengan workflow pengelolaan penulisan soal yang lebih sederhana.

## Fitur baru

- Menu baru: Dashboard, Alur Kerja, Kisi-kisi, Tulis Soal, Validasi Soal, Paket Diujikan, User, Pengaturan.
- Role baru:
  - Penulis Kisi-kisi (`BLUEPRINT_AUTHOR`)
  - Penulis Soal (`QUESTION_AUTHOR`)
  - Validator Soal (`QUESTION_VALIDATOR`)
  - Admin Ujian (`EXAM_ADMIN`)
  - Super Admin (`SUPER_ADMIN`)
- CRUD database untuk kisi-kisi.
- CRUD database untuk soal.
- Validator dapat mengedit soal, opsi jawaban, pembahasan, dan kunci jawaban.
- Paket ujian dapat memilih soal yang sudah `APPROVED`.
- CRUD user dan role untuk super admin.
- Dashboard memakai hitungan langsung dari database.
- Seed database membuat role dan super admin awal.
- Ditambahkan model `ExamPackageQuestion` untuk menampung soal yang dipilih admin ujian sebelum dipublikasikan.

## Catatan teknis

- Prisma schema diperbarui.
- Root `package.json` ditambah `postinstall` untuk menjalankan Prisma generate.
- Ditambahkan script `vercel-build:admin` dan `vercel-build:exam`.
