import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "node:crypto";

const prisma = new PrismaClient();
const HASH_ITERATIONS = 210_000;
const HASH_KEY_LENGTH = 32;
const HASH_ALGORITHM = "sha256";

const ROLES = [
  ["BLUEPRINT_AUTHOR", "Penulis Kisi-kisi"],
  ["QUESTION_AUTHOR", "Penulis Soal"],
  ["QUESTION_VALIDATOR", "Validator Soal"],
  ["EXAM_ADMIN", "Admin Ujian"],
  ["EXAM_SUPERVISOR", "Pengawas Ujian"],
  ["SUPER_ADMIN", "Super Admin"]
];

const PERMISSIONS = [
  ["ADMIN_ACCESS", "Akses dashboard admin"],
  ["BLUEPRINT_CRUD", "Kelola kisi-kisi"],
  ["QUESTION_CRUD", "Kelola soal"],
  ["QUESTION_VALIDATE", "Validasi dan edit soal"],
  ["EXAM_PACKAGE_CRUD", "Kelola paket ujian"],
  ["ASSIGNMENT_CRUD", "Kelola plotting penulis dan validator"],
  ["USER_CRUD", "Kelola user"],
  ["EXAM_SUPERVISE", "Akses dashboard pengawas dan monitoring ujian"]
];

const ROLE_PERMISSIONS = {
  BLUEPRINT_AUTHOR: ["ADMIN_ACCESS", "BLUEPRINT_CRUD"],
  QUESTION_AUTHOR: ["ADMIN_ACCESS", "QUESTION_CRUD"],
  QUESTION_VALIDATOR: ["ADMIN_ACCESS", "QUESTION_VALIDATE"],
  EXAM_ADMIN: ["ADMIN_ACCESS", "ASSIGNMENT_CRUD", "EXAM_PACKAGE_CRUD", "EXAM_SUPERVISE"],
  EXAM_SUPERVISOR: ["ADMIN_ACCESS", "EXAM_SUPERVISE"],
  SUPER_ADMIN: PERMISSIONS.map(([code]) => code)
};

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString("hex");
  return `pbkdf2_${HASH_ALGORITHM}$${HASH_ITERATIONS}$${salt}$${hash}`;
}

const email = (process.env.ADMIN_EMAIL || "admin@seleksi.id").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "Admin12345!";
const name = process.env.ADMIN_NAME || "Super Admin";

if (password.length < 8) {
  throw new Error("ADMIN_PASSWORD minimal 8 karakter.");
}

async function main() {
  const roleByCode = new Map();
  const permissionByCode = new Map();

  for (const [code, roleName] of ROLES) {
    const role = await prisma.role.upsert({
      where: { code },
      update: { name: roleName },
      create: { code, name: roleName }
    });
    roleByCode.set(code, role);
  }

  for (const [code, permissionName] of PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: { name: permissionName },
      create: { code, name: permissionName }
    });
    permissionByCode.set(code, permission);
  }

  for (const [roleCode, permissionCodes] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleByCode.get(roleCode);
    for (const permissionCode of permissionCodes) {
      const permission = permissionByCode.get(permissionCode);
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id }
      });
    }
  }

  await prisma.selectionPeriod.upsert({
    where: { code: "PERIODE-UTAMA" },
    update: { name: "Periode Utama" },
    create: { code: "PERIODE-UTAMA", name: "Periode Utama" }
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash: hashPassword(password), isActive: true },
    create: { email, name, passwordHash: hashPassword(password), isActive: true }
  });

  const superAdmin = roleByCode.get("SUPER_ADMIN");
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: superAdmin.id } },
    update: {},
    create: { userId: user.id, roleId: superAdmin.id }
  });

  console.log(`Super admin siap: ${email}`);
  console.log("Role siap: Penulis Kisi-kisi, Penulis Soal, Validator Soal, Admin Ujian, Pengawas Ujian, Super Admin.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
