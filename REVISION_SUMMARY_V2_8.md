# Ringkasan Revisi SoalFlow v2.8.0

## 1. Perbaikan otorisasi role

- Route tidak lagi hanya dilindungi melalui menu sidebar.
- Setiap halaman sensitif memeriksa role di server sebelum membaca data.
- Server Action untuk tambah, edit, hapus, upload, plotting, paket, peserta, penulisan, dan validasi memeriksa role kembali.
- Penulis soal tidak dapat membuka `/imports`, `/users`, `/settings`, atau menu role lain melalui URL langsung.
- Penulis soal hanya dapat mengubah kisi-kisi yang memang diplot kepadanya.
- Endpoint validasi aset mewajibkan sesi admin yang aktif.

## 2. Dashboard

- Panel **Akses cepat** dihapus.
- Tombol utama pada hero dashboard menyesuaikan role pengguna agar tidak mengarah ke halaman yang tidak diizinkan.

## 3. Tabel Tulis Soal dan Validasi Soal

- Menggunakan kontrol kolom seperti halaman Kisi-kisi.
- Kolom dapat disembunyikan atau ditampilkan dengan ikon panah.
- Preferensi kolom tersimpan di `localStorage`.
- Perubahan kolom disinkronkan ke seluruh kelompok kisi-kisi pada halaman yang sama.
- Tabel Validasi mendukung kontrol hingga enam kolom.

## 4. Sidebar

- Sidebar memakai layout fleksibel tiga bagian.
- Logo tetap di atas.
- Daftar menu dapat di-scroll secara vertikal.
- Profil, email, role, dan tombol keluar tetap berada di bawah.
- Menu Pengaturan tidak lagi menabrak blok identitas pengguna pada layar pendek.

## Database

Tidak ada perubahan schema database pada v2.8.0.
