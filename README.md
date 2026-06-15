# SoalFlow v3.2.0

Platform pengelolaan kisi-kisi, penulisan, validasi, paket ujian multi-bidang, plotting peserta, pelaksanaan ujian, serta analisis nilai dan parameter soal.

## Instalasi cepat

```bash
npm run setup
```

Jika `DATABASE_URL` belum diisi, edit `.env`, lalu jalankan:

```bash
npm run setup:db
npm run dev
```

- Admin: `http://localhost:3000`
- Aplikasi ujian peserta: `http://localhost:3001`

## Fokus v3.2.0

Menu baru **Nilai & Parameter Soal** untuk Admin Ujian dan Super Admin menyediakan:

- rekap nilai peserta berdasarkan paket ujian;
- ekspor Excel;
- tingkat kesukaran butir (P);
- daya beda kelompok atas dan bawah 27% (D);
- validitas point-biserial terkoreksi;
- analisis fungsi setiap pengecoh;
- reliabilitas Cronbach's Alpha atau pendekatan KR-20;
- analisis yang tetap tepat saat paket memakai random satu soal per kisi-kisi.

Fitur pagination v3.1.0, konsistensi tabel v3.0.0, paket multi-bidang, stimulus Bahasa Inggris, plotting peserta, role, dan keamanan ujian tetap tersedia.

Baca `INSTALL_V3_2.md` dan `REVISION_SUMMARY_V3_2.md`.
