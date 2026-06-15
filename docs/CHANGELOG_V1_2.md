# Changelog Versi 1.2

## UI Admin

- Menambahkan tombol hide/show sidebar pada topbar admin.
- Status sidebar disimpan ke `localStorage` agar preferensi pengguna tetap aktif setelah refresh.
- Mengubah label kontrol ukuran teks dari `A kecil`, `A sedang`, `A besar` menjadi `A A A` dengan perbedaan ukuran visual saja.

## Login Admin

- Menambahkan halaman `/login`.
- Menambahkan API `/api/auth/login` dan `/api/auth/logout`.
- Halaman admin kini memeriksa sesi login sebelum menampilkan dashboard.
- Sidebar footer menampilkan nama/email admin dan tombol keluar.

## Database Auth

- Menambahkan `User.passwordHash`.
- Menambahkan `User.lastLoginAt`.
- Menambahkan model `UserSession` untuk sesi login aktif.
- Menambahkan script `npm run db:seed` untuk membuat akun admin awal.

## Dokumentasi

- Menambahkan `.env.example` untuk `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `ADMIN_NAME`.
- Menambahkan panduan `docs/DATABASE_SETUP_V1_2.md`.
