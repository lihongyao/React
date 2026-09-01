import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const schoolClass = await prisma.schoolClass.upsert({
    where: { grade_name: { grade: 2026, name: "1班" } },
    update: {},
    create: { grade: 2026, name: "1班" },
  });

  const programming = await prisma.course.upsert({
    where: { code: "CS101" },
    update: { name: "程序设计基础", credits: 3 },
    create: { code: "CS101", name: "程序设计基础", credits: 3 },
  });

  await prisma.course.upsert({
    where: { code: "MATH101" },
    update: { name: "高等数学", credits: 4 },
    create: { code: "MATH101", name: "高等数学", credits: 4 },
  });

  const student = await prisma.student.upsert({
    where: { studentNo: "S20260001" },
    update: { schoolClassId: schoolClass.id },
    create: {
      studentNo: "S20260001",
      name: "张三",
      email: "zhangsan@example.com",
      schoolClassId: schoolClass.id,
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student.id,
        courseId: programming.id,
      },
    },
    update: { score: 92.5 },
    create: {
      studentId: student.id,
      courseId: programming.id,
      score: 92.5,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });