import { Prisma } from "@/generated/prisma/client";
import { studentFormSchema } from "@/features/students/schema";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: { studentNo: "asc" },
  });

  return Response.json(students);
}

export async function POST(request: Request) {
  const result = studentFormSchema.safeParse(await request.json());

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 });
  }

  try {
    const student = await prisma.student.create({ data: result.data });
    return Response.json(student, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return Response.json({ error: "学号或邮箱已存在" }, { status: 409 });
    }
    throw error;
  }
}
