# Workflow Validasi

## Konfigurasi bertingkat

Workflow tidak di-hardcode menjadi dua tingkat. Setiap organisasi/periode dapat menentukan jumlah tahap, misalnya:

1. Validator substansi
2. Validator bahasa
3. Validator metodologi
4. Validator akhir

Setiap tahap memiliki:

- urutan;
- role yang berhak;
- jumlah persetujuan minimum;
- apakah validator boleh mengedit;
- apakah perubahan kunci memerlukan eskalasi;
- SLA opsional.

## Keputusan

- `APPROVE`
- `REQUEST_REVISION`
- `REJECT`
- `EDIT_AND_FORWARD`

## Edit oleh validator

Saat validator mengedit:

1. Buat versi baru.
2. Catat field yang berubah.
3. Simpan alasan melalui WYSIWYG.
4. Tandai perubahan kunci jawaban.
5. Teruskan ke tahap berikutnya atau kembali ke penulis sesuai workflow.

## Perubahan stimulus

Setiap perubahan stimulus menyebabkan soal terkait berstatus `NEEDS_ALIGNMENT_REVIEW`, kecuali perubahan hanya metadata nonkonten yang telah diklasifikasikan aman.
