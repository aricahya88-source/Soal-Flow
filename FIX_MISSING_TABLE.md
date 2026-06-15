# Fix Error: QuestionWritingAssignment does not exist

Jika muncul error:

```text
The table `public.QuestionWritingAssignment` does not exist in the current database.
```

jalankan dari root project:

```bash
npm run repair:db
npm run dev
```

Atau manual:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Catatan penting:

- Jangan pakai `migrate deploy` untuk memperbaiki database lokal yang sudah pernah dipakai versi lama.
- `migrate deploy` hanya menjalankan migration yang belum tercatat di tabel `_prisma_migrations`.
- `db push` menyamakan database dengan `schema.prisma`, sehingga cocok untuk development lokal.
