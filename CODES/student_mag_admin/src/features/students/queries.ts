import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 20;

export async function getStudents(keyword = "", page = 1) {
  const requestedPage = Number.isInteger(page) ? Math.max(1, page) : 1;
  const normalizedKeyword = keyword.trim();
  const where: Prisma.StudentWhereInput = normalizedKeyword
    ? {
        OR: [
          { name: { contains: normalizedKeyword, mode: "insensitive" } },
          { studentNo: { contains: normalizedKeyword, mode: "insensitive" } },
          { email: { contains: normalizedKeyword, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.$transaction(async (tx) => {
    const total = await tx.student.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const currentPage = Math.min(requestedPage, pageCount);
    const students = await tx.student.findMany({
      where,
      select: {
        id: true,
        studentNo: true,
        name: true,
        email: true,
        status: true,
        schoolClass: { select: { grade: true, name: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { studentNo: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    return { students, total, page: currentPage, pageCount };
  });
}

export async function getStudentStats() {
  const [studentCount, activeCount, classCount] = await prisma.$transaction([
    prisma.student.count(),
    prisma.student.count({ where: { status: "ACTIVE" } }),
    prisma.schoolClass.count(),
  ]);

  return { studentCount, activeCount, classCount };
}

export function getSchoolClasses() {
  return prisma.schoolClass.findMany({
    orderBy: [{ grade: "desc" }, { name: "asc" }],
  });
}

export function getStudent(id: number) {
  return prisma.student.findUnique({ where: { id } });
}
