#!/usr/bin/env bash
set -e

echo "=== SoalFlow v2.9 - Instalasi Lokal ==="

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "File .env dibuat dari .env.example"
  echo "Silakan isi DATABASE_URL dan AUTH_SECRET terlebih dahulu: nano .env"
  exit 0
fi

npm install
npm run setup:db

echo ""
echo "Instalasi selesai. Jalankan aplikasi dengan:"
echo "npm run dev"
echo ""
echo "Admin Panel : http://localhost:3000"
echo "Exam App    : http://localhost:3001"
