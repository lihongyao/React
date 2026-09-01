import { updateStudent } from "@/features/students/actions";
import { getSchoolClasses, getStudent } from "@/features/students/queries";
import { StudentForm } from "@/features/students/student-form";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditStudentPage({ params }: Props) {
  const { id } = await params;
  const studentId = Number(id);

  if (!Number.isInteger(studentId) || studentId < 1) notFound();

  const [student, classes] = await Promise.all([
    getStudent(studentId),
    getSchoolClasses(),
  ]);

  if (!student) notFound();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-emerald-700">学生档案</p>
        <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">编辑学生</h1>
        <p className="mt-2 text-sm text-zinc-500">
          正在编辑 {student.name}（{student.studentNo}）
        </p>
      </div>

      <section className="mt-8 border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-zinc-950">基础信息</h2>
          <p className="mt-1 text-xs text-zinc-500">修改后保存即可更新学生档案</p>
        </div>
        <div className="p-5 sm:p-6">
          <StudentForm
            action={updateStudent.bind(null, student.id)}
            classes={classes}
            student={student}
          />
        </div>
      </section>
    </main>
  );
}
