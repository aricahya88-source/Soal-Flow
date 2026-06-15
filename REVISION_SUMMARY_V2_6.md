# Ringkasan Revisi SoalFlow v2.6.0

## Kisi-kisi

- Pilihan `INDEPENDENT` atau `STIMULUS_GROUP`.
- Form stimulus: bahasa, jenis, judul, petunjuk, isi, sumber, dan hak cipta.
- Satu stimulus ditautkan langsung ke satu kode kisi-kisi.
- Jumlah soal menentukan slot otomatis dan urutan pertanyaan.

## Penulisan soal

- Reading text tampil satu kali pada kelompok.
- Setiap slot hanya memuat pertanyaan dan pilihan jawaban.
- `orderInStimulus` tersimpan pada setiap versi soal.
- Satu tombol kirim per kode kisi-kisi mengirim stimulus dan seluruh soal.

## Validasi

- Antrian dikelompokkan berdasarkan kode kisi-kisi.
- Validator dapat meninjau/mengedit stimulus.
- Revisi stimulus menandai soal terkait untuk pemeriksaan keselarasan ulang.

## Paket ujian

- Kelompok stimulus dipilih sebagai satu blok.
- Blok hanya siap jika stimulus dan semua soal telah disetujui.
- Pengacakan blok dipisahkan dari pengacakan soal mandiri.

## Upload Excel

- Template kisi-kisi memuat data stimulus.
- Template soal memuat `urutan_stimulus`.
- Reading text tidak diduplikasi pada setiap baris soal.

## Database

- Menambahkan `QuestionMode`.
- Menautkan `Stimulus` ke `Blueprint`.
- Upgrade lokal menggunakan `prisma db push` agar kompatibel dengan database lama.
