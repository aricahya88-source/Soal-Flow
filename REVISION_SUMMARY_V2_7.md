# Ringkasan Revisi SoalFlow v2.7.0

## Fokus: pembuatan paket ujian

- Paket diawali dengan isian **bidang yang diuji**.
- Pemilihan konten dilakukan berdasarkan kode kisi-kisi, bukan memilih soal satu per satu.
- Setiap kode kisi-kisi memiliki aturan:
  - `RANDOM_ONE`: satu soal APPROVED dipilih saat peserta pertama kali memulai ujian.
  - `ALL`: semua soal APPROVED pada kode tersebut dimasukkan.
- Hasil random disimpan sebagai snapshot attempt sehingga tidak berubah setelah refresh atau login ulang.
- Untuk reading text, stimulus tetap disertakan ketika hanya satu pertanyaan yang dipilih.
- Paket memiliki jadwal mulai, batas selesai, durasi, pengacakan urutan kisi-kisi, dan pengacakan opsi.

## Peserta ujian

- Menu baru **Peserta Ujian**.
- Login peserta menggunakan username angka/teks dan password, tanpa email.
- Mendukung penambahan satu peserta atau input massal format `username,nama,password`.
- Password disimpan dengan PBKDF2-SHA256 dan salt unik.
- Plotting peserta dilakukan pada setiap paket.
- Peserta hanya melihat paket yang diplot ke akunnya.

## Aplikasi ujian port 3001

- Login peserta nyata, bukan lagi hanya demo.
- Dashboard paket peserta.
- Random soal per peserta dan snapshot permanen per attempt.
- Timer dihitung dari server dan dibatasi oleh jadwal sesi.
- Autosave jawaban dan tanda ragu ke server.
- Penilaian dilakukan di server; kunci jawaban tidak dikirim ke browser.
- Kirim otomatis ketika waktu habis.

## Keamanan dan audit

- Permintaan fullscreen saat ujian.
- Blok copy, cut, print, save page, view source, klik kanan, drag, dan shortcut developer tools umum.
- Deteksi tab tersembunyi, window blur, dan keluar fullscreen.
- Watermark username dan nama peserta.
- Header `no-store`, anti-iframe, no-referrer, dan pembatasan permissions browser.
- Catatan insiden dapat terlihat pada plotting peserta/admin.
- Tidak ada klaim bahwa screenshot perangkat dapat diblokir 100%.

## Perubahan database

- Aturan kisi-kisi per paket (`ExamPackageBlueprintRule`).
- Mode pemilihan `ALL` dan `RANDOM_ONE`.
- Bidang dan jadwal paket.
- Username/password/session peserta.
- Snapshot soal per attempt.
- Log insiden keamanan ujian.
