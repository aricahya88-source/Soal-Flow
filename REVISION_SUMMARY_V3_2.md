# Ringkasan Revisi SoalFlow v3.2.0

## Menu baru

Menu **Nilai & Parameter Soal** tersedia untuk role:

- Admin Ujian
- Super Admin

Route halaman dan route ekspor Excel sama-sama dilindungi pemeriksaan role server-side.

## Nilai peserta

Rekap menampilkan:

- username;
- nama peserta;
- jumlah benar;
- jumlah salah;
- jumlah tidak dijawab;
- jumlah soal;
- nilai skala 0–100;
- waktu pengiriman.

Hasil dapat diunduh sebagai Excel.

## Tingkat kesukaran

Tingkat kesukaran dihitung dengan:

```text
P = jumlah peserta menjawab benar / jumlah peserta yang menerima butir
```

Interpretasi:

- P < 0,30: Sukar
- 0,30 ≤ P ≤ 0,70: Sedang
- P > 0,70: Mudah

## Daya beda

Daya beda menggunakan kelompok atas dan kelompok bawah masing-masing 27% dari peserta yang menerima butir:

```text
D = proporsi benar kelompok atas - proporsi benar kelompok bawah
```

Butir dengan D negatif ditandai sebagai bermasalah.

## Validitas point-biserial

Validitas butir menggunakan korelasi point-biserial terkoreksi. Skor butir 0/1 dikorelasikan dengan skor total setelah skor butir tersebut dikeluarkan dari total.

## Fungsi pengecoh

Setiap opsi menampilkan jumlah dan persentase pemilih. Opsi salah dianggap berfungsi jika dipilih minimal 5% peserta yang menerima butir. Opsi yang tidak pernah dipilih ditandai tidak berfungsi.

## Reliabilitas

Reliabilitas dihitung berdasarkan unit kode kisi-kisi agar kompatibel dengan paket random satu soal:

- jika setiap unit bernilai dikotomis 0/1, metode ditampilkan sebagai KR-20 / Cronbach's Alpha;
- jika satu kisi-kisi mengujikan beberapa soal, unit menggunakan proporsi benar dan dihitung dengan Cronbach's Alpha;
- reliabilitas ditampilkan untuk seluruh paket dan per bidang yang memiliki minimal dua kisi-kisi.

## Ekspor Excel

File Excel memiliki sheet:

1. Ringkasan
2. Nilai Peserta
3. Parameter Soal
4. Fungsi Pengecoh
5. Reliabilitas

## Database

Tidak ada perubahan schema database.
