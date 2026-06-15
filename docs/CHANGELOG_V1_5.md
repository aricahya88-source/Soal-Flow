# Changelog Versi 1.5

## Perubahan utama

1. Halaman login tidak lagi otomatis mengisi email `admin@seleksi.id`.
2. Input email login sekarang kosong saat halaman dibuka.
3. Ditambahkan placeholder `Masukkan email admin` agar pengguna tetap tahu format isian.
4. Form login diberi `autoComplete="off"` untuk mengurangi kemungkinan browser mengisi otomatis data login lama.
5. Konfigurasi Next.js admin diperbarui dengan `serverExternalPackages` untuk membantu mencegah error Prisma Client pada runtime Next.js/Vercel.

## Catatan

Akun admin default tetap dapat dibuat melalui seed database menggunakan environment variable:

```env
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
```

Namun email tersebut tidak lagi muncul otomatis pada form login.
