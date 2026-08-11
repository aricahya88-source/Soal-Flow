import type { Prisma } from "@prisma/client";
import type { CurrentUser } from "@/lib/auth";

export const QUESTION_EXPORT_ROLES = [
  "QUESTION_AUTHOR",
  "QUESTION_VALIDATOR",
  "EXAM_ADMIN",
  "SUPER_ADMIN",
] as const;

export function questionExportAccessWhere(user: Pick<CurrentUser, "id" | "roles">): Prisma.QuestionWhereInput {
  if (user.roles.includes("SUPER_ADMIN") || user.roles.includes("EXAM_ADMIN")) {
    return {};
  }

  const scopes: Prisma.QuestionWhereInput[] = [];

  if (user.roles.includes("QUESTION_AUTHOR")) {
    scopes.push({
      blueprint: {
        writingAssignments: {
          some: {
            assignedToId: user.id,
            status: { not: "CANCELLED" },
          },
        },
      },
    });
  }

  if (user.roles.includes("QUESTION_VALIDATOR")) {
    scopes.push({
      validationAssignments: {
        some: {
          assignedToId: user.id,
          status: { not: "CANCELLED" },
        },
      },
    });
  }

  if (!scopes.length) {
    return { id: "__NO_EXPORT_ACCESS__" };
  }

  if (scopes.length === 1) return scopes[0];
  return { OR: scopes };
}

export function blueprintExportAccessWhere(user: Pick<CurrentUser, "id" | "roles">): Prisma.BlueprintWhereInput {
  if (user.roles.includes("SUPER_ADMIN") || user.roles.includes("EXAM_ADMIN")) {
    return {};
  }

  const scopes: Prisma.BlueprintWhereInput[] = [];

  if (user.roles.includes("QUESTION_AUTHOR")) {
    scopes.push({
      writingAssignments: {
        some: {
          assignedToId: user.id,
          status: { not: "CANCELLED" },
        },
      },
    });
  }

  if (user.roles.includes("QUESTION_VALIDATOR")) {
    scopes.push({
      questions: {
        some: {
          validationAssignments: {
            some: {
              assignedToId: user.id,
              status: { not: "CANCELLED" },
            },
          },
        },
      },
    });
  }

  if (!scopes.length) {
    return { id: "__NO_EXPORT_ACCESS__" };
  }

  if (scopes.length === 1) return scopes[0];
  return { OR: scopes };
}
