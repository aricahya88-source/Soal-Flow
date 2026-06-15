# Keamanan

## Pemisahan aplikasi

- Admin dan exam memakai environment variable serta akun database berbeda.
- Exam hanya membaca published snapshot dan menulis jawaban milik peserta.
- Draft, review, pembahasan, dan kunci jawaban tidak tersedia bagi exam client.

## Konten WYSIWYG

- Sanitasi HTML di server sebelum disimpan atau dirender.
- Batasi tag dan atribut.
- Tolak script, iframe, event handler, dan URL berbahaya.
- Untuk produksi, simpan JSON editor sebagai sumber utama dan hasil HTML terkontrol sebagai cache.

## Upload

- Verifikasi MIME dan magic bytes.
- Gambar maksimal 102400 byte.
- Randomisasi nama storage.
- Bucket privat untuk aset ujian.
- URL bertanda tangan dengan masa berlaku singkat.
- Audio dan ZIP memakai batas serta pemeriksaan terpisah.

## Ujian

- Timer berdasarkan server.
- Autosave idempoten.
- Submit transaksional.
- Rate limit login, autosave, dan submit.
- Kunci jawaban dinilai di server.
- Audit aktivitas sensitif.
