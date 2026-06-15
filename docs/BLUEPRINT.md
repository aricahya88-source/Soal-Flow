# Blueprint Platform Seleksi

## 1. Sasaran

Membangun satu platform dengan dua aplikasi terpisah yang menggunakan PostgreSQL yang sama, tetapi memiliki hak akses dan permukaan serangan berbeda.

```text
admin.domain.tld                  ujian.domain.tld
Pengelolaan konten                Pelaksanaan ujian
        │                                  │
        └──────── PostgreSQL ──────────────┘
                 + Object Storage
```

## 2. Aplikasi

### Admin

Peran utama:

- Pembuat kisi-kisi
- Pembuat soal
- Validator bertingkat
- Super admin

Modul:

1. Dashboard
2. Master data
3. Kisi-kisi dan versi
4. Stimulus dan versi
5. Bank soal dan versi
6. Validasi bertingkat
7. Impor Excel/Word
8. Media gambar/audio
9. Paket ujian dan snapshot publikasi
10. PDF dan laporan
11. Pengguna, role, permission
12. Audit log

### Exam

Modul:

1. Login/token peserta
2. Instruksi
3. Sesi ujian berbasis waktu server
4. Stimulus dengan satu atau banyak soal
5. Navigasi dan tanda ragu-ragu
6. Autosave idempoten
7. Pemulihan koneksi
8. Submit final
9. Hasil, bila diizinkan

## 3. Prinsip arsitektur

- Satu monorepo, dua project Vercel.
- Satu database, kredensial dan permission berbeda.
- Konten kerja tidak dibaca langsung oleh aplikasi peserta.
- Paket ujian memakai snapshot stimulus, soal, opsi, dan konfigurasi.
- Kunci jawaban tidak pernah dikirim ke browser peserta.
- Semua perubahan penting menggunakan versioning dan audit log.
- Stimulus dan pertanyaan disimpan sebagai dokumen terstruktur; HTML hanya menjadi hasil render/cache.

## 4. Palet dan aksesibilitas

| Token | Warna | Penggunaan |
|---|---|---|
| Primary | `#0A7C6E` | navigasi, aksi utama, fokus |
| Warning | `#F59E0B` | status perlu perhatian |
| Accent | `#FF6B35` | aksi berisiko/penekanan |
| Canvas | `#FAFAFA` | latar mode terang |

Mode gelap memakai canvas gelap kehijauan dengan kontras teks yang tetap tinggi. Preferensi tema dan ukuran teks disimpan di browser.

Ukuran teks:

- Kecil: `15px`
- Sedang: `16px`
- Besar: `18px`

## 5. Model konten

### Stimulus

Stimulus adalah sumber bersama bagi satu atau banyak soal:

- teks bacaan;
- gambar;
- tabel;
- audio;
- kombinasi.

Contoh reading:

```text
ENG-READ-001
├── ENG-001
├── ENG-002
├── ENG-003
├── ENG-004
└── ENG-005
```

Pertanyaan menyimpan referensi ke `stimulus_version_id`, bukan hanya `stimulus_id`, agar perubahan stimulus dapat memicu validasi ulang.

### Soal

Jenis awal: pilihan ganda satu jawaban benar, opsi A–E, tanpa pengurangan nilai.

Konten yang dapat memakai WYSIWYG:

- deskripsi kisi-kisi;
- indikator;
- stimulus;
- pertanyaan;
- setiap pilihan jawaban;
- pembahasan;
- masukan validator;
- ringkasan perubahan;
- instruksi ujian.

## 6. Workflow

### Kisi-kisi

```text
DRAFT → REVIEW_LEVEL_1 → REVIEW_LEVEL_2 → APPROVED
  ↑             │              │
  └── REVISION_REQUIRED ────────┘
```

Penulis soal dapat mengusulkan revisi kisi-kisi. Revisi menghasilkan versi baru dan tidak menimpa versi yang telah disetujui.

### Soal

```text
DRAFT → SUBMITTED → REVIEW_LEVEL_1 → REVIEW_LEVEL_2 → APPROVED → PUBLISHED
                         │                 │
                         └── REVISION_REQUIRED ──→ versi baru
```

Validator boleh mengubah pertanyaan dan jawaban. Setiap perubahan harus mencatat:

- pengguna;
- peran;
- alasan;
- field yang berubah;
- versi sebelum dan sesudah;
- waktu.

Perubahan kunci jawaban ditandai sebagai perubahan sensitif dan harus ditinjau pada tingkat berikutnya.

## 7. Impor

Metode utama: Excel + folder media dalam ZIP.

```text
paket-impor.zip
├── soal.xlsx
└── media/
    ├── diagram-01.webp
    └── listening-01.mp3
```

Semua impor masuk ke staging:

```text
UPLOAD → PARSE → VALIDATE → PREVIEW → CONFIRM → DRAFT
```

Tidak ada data impor yang langsung berstatus disetujui.

## 8. Media

### Gambar

- PNG, JPEG, atau WebP.
- Maksimum 100 KB per file.
- Disarankan lebar maksimum 1600 px.
- Validasi ukuran di browser dan server.
- Simpan di object storage, bukan database.
- Simpan checksum, MIME, dimensi, uploader, alt text, dan sumber.

### Audio

Audio memiliki batas terpisah dari gambar. Simpan kebijakan pemutaran pada relasi stimulus/aset.

## 9. PDF

Dokumen yang dapat diekspor:

- kisi-kisi;
- kartu soal;
- lembar validasi;
- riwayat revisi;
- paket soal;
- kunci jawaban;
- audit laporan.

PDF dibuat dari snapshot dan memuat nomor dokumen, versi, pembuat, tanggal, status, serta kode verifikasi.

## 10. Batas MVP

MVP sebaiknya mencakup:

1. Auth dan RBAC
2. Master data
3. Kisi-kisi dan validasi
4. Stimulus dan soal pilihan ganda
5. WYSIWYG
6. Versioning
7. Impor Excel
8. Upload gambar 100 KB
9. Pembuatan paket dan snapshot
10. Website peserta dasar
11. PDF inti
12. Audit log

Word massal, pemrosesan audio lanjut, analitik psikometrik, dan load testing skala besar masuk fase berikutnya.
