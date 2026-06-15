# Spesifikasi Impor Excel dan Word

## Excel

Gunakan `templates/import-template.xlsx`.

### Sheet STIMULUS

Kolom utama:

- `stimulus_code`
- `title`
- `stimulus_type`
- `language`
- `instructions_html`
- `stimulus_text_html`
- `image_file`
- `audio_file`
- `source`
- `copyright_note`
- `expected_questions`
- `notes_html`

### Sheet QUESTIONS

Kolom utama:

- `question_code`
- `stimulus_code`
- `order_in_stimulus`
- `blueprint_code`
- `question_html`
- `option_a_html` sampai `option_e_html`
- `answer_key`
- `explanation_html`
- `difficulty`
- `question_image`
- `notes_html`

Kolom HTML menerima HTML terbatas hasil WYSIWYG. Parser wajib melakukan sanitasi.

## ZIP media

Nama file pada Excel harus sama persis dengan file di folder media. File tidak boleh menggunakan path absolut atau `../`.

Gambar yang melebihi 100 KB ditolak. File media yang tidak direferensikan diberi peringatan.

## Word

Tahap awal menggunakan format berpola di `templates/word-format-template.md`. Impor DOCX wajib melalui preview karena struktur bebas, tabel, gambar, dan persamaan dapat menghasilkan ambiguitas.

## Validasi

- Referensi kisi-kisi ada.
- Referensi stimulus ada.
- Kode unik.
- Urutan dalam stimulus unik dan berurutan.
- Opsi A–E tersedia sesuai kebijakan.
- Kunci menunjuk opsi yang tersedia.
- Media ditemukan dan valid.
- Gambar ≤ 100 KB.
- HTML disanitasi.
- Jumlah soal stimulus sesuai `expected_questions`.

## Hasil impor

Setiap baris memiliki status:

- `VALID`
- `WARNING`
- `ERROR`
- `IMPORTED`
- `SKIPPED`

## Upload langsung v2.5

Super Admin dapat memakai menu **Upload Kisi-kisi & Soal**.

Template resmi:

- `templates/template-upload-kisi-kisi.xlsx`
- `templates/template-upload-soal.xlsx`

Soal hasil upload selalu berstatus `DRAFT`. Pengiriman dilakukan per kode kisi-kisi melalui satu tombol pada menu Tulis Soal.
