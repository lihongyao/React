"use server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { studentFormSchema, type StudentFormState } from "./schema";

function parseStudentForm(formData: FormData) {
  return studentFormSchema.safeParse({
    studentNo: formData.get("studentNo"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    schoolClassId: formData.get("schoolClassId"),
  });
}

function getDatabaseError(error: unknown): StudentFormState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const target = Array.isArray(error.meta?.target) ? error.meta.target : [];

    if (target.includes("studentNo")) {
      return {
        status: "error",
        message: "该学号已存在，请更换后重试。",
        fieldErrors: { studentNo: ["学号不能重复"] },
      };
    }

    if (target.includes("email")) {
      return {
        status: "error",
        message: "该邮箱已被使用，请更换后重试。",
        fieldErrors: { email: ["邮箱不能重复"] },
      };
    }
  }

  return { status: "error", message: "保存失败，请稍后重试。" };
}

export async function createStudent(
  _previousState: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const result = parseStudentForm(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "请检查表单中的内容。",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.student.create({ data: result.data });
  } catch (error) {
    return getDatabaseError(error);
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function updateStudent(
  id: number,
  _previousState: StudentFormState,
  formData: FormData,
): Promise<StudentFormState> {
  const result = parseStudentForm(formData);

  if (!result.success) {
    return {
      status: "error",
      message: "请检查表单中的内容。",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.student.update({ where: { id }, data: result.data });
  } catch (error) {
    return getDatabaseError(error);
  }

  revalidatePath("/students");
  redirect("/students");
}

export async function deleteStudent(id: number) {
  await prisma.student.delete({ where: { id } });
  revalidatePath("/students");
}
