import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@seleksi/ui",
    "@seleksi/question-renderer",
    "@seleksi/validation",
    "@seleksi/database"
  ],
  serverExternalPackages: ["@prisma/client", "prisma", "xlsx", "pdfmake-rtl"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  outputFileTracingIncludes: {
    "/api/question-exports": [
      "./node_modules/pdfmake-rtl/fonts/**/*",
      "../../node_modules/pdfmake-rtl/fonts/**/*"
    ]
  },
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  reactStrictMode: true
};

export default nextConfig;
