# Instalasi Lokal Seleksi Platform v2.2

```bash
cd seleksi-platform-v2.2
cp .env.example .env
npm install
npm run secret
```

Isi `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
AUTH_SECRET="hasil-npm-run-secret"
ADMIN_EMAIL="admin@seleksi.id"
ADMIN_PASSWORD="Admin12345!"
ADMIN_NAME="Super Admin"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Setup database:

```bash
npm run setup:db
```

Jalankan admin:

```bash
npm run dev:admin
```

Buka `http://localhost:3000`.

## Alur penggunaan

1. Login sebagai super admin.
2. Buat user sesuai role.
3. Buat kisi-kisi pada menu Kisi-kisi.
4. Plotting penulis soal pada menu Plotting Tugas.
5. Penulis soal membuat soal pada menu Tulis Soal.
6. Plotting validator soal pada menu Plotting Tugas.
7. Validator memvalidasi pada menu Validasi Soal.
8. Admin memilih soal APPROVED pada menu Paket Diujikan.
