import { createStudent } from "@/features/students/actions";
import { getSchoolClasses } from "@/features/students/queries";
import { StudentForm } from "@/features/students/student-form";

export default async function NewStudentPage() {
  const classes = await getSchoolClasses();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase text-emerald-700">学生档案</p>
        <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">新增学生</h1>
        <p className="mt-2 text-sm text-zinc-500">创建学生档案并设置初始班级。</p>
      </div>

      <section className="mt-8 border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-zinc-950">基础信息</h2>
          <p className="mt-1 text-xs text-zinc-500">标有 * 的字段为必填项</p>
        </div>
        <div className="p-5 sm:p-6">
          <StudentForm action={createStudent} classes={classes} />
        </div>
      </section>
    </main>
  );
}
