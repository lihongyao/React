import { deleteStudent } from "@/features/students/actions";
import { DeleteStudentButton } from "@/features/students/delete-student-button";
import { getStudents, getStudentStats } from "@/features/students/queries";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Pencil,
  Plus,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ keyword?: string; page?: string }>;
};

const statusMap = {
  ACTIVE: { label: "在读", className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  SUSPENDED: { label: "休学", className: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  GRADUATED: { label: "已毕业", className: "bg-zinc-100 text-zinc-600 ring-zinc-500/20" },
} as const;

function pageHref(keyword: string, page: number) {
  const query: Record<string, string | number> = { page };
  if (keyword) query.keyword = keyword;
  return { pathname: "/students", query };
}

export default async function StudentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyword = params.keyword?.trim() ?? "";
  const parsedPage = Number(params.page ?? "1");
  const page = Number.isInteger(parsedPage) ? parsedPage : 1;
  const [result, stats] = await Promise.all([getStudents(keyword, page), getStudentStats()]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-emerald-700">学生档案</p>
          <h1 className="text-2xl font-bold text-zinc-950 sm:text-3xl">学生管理</h1>
          <p className="mt-2 text-sm text-zinc-500">维护学生基础资料、班级归属与在校状态。</p>
        </div>
        <Link
          href="/students/new"
          className="inline-flex h-10 items-center justify-center gap-2 bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <Plus aria-hidden="true" className="size-4" />
          新增学生
        </Link>
      </div>

      <section aria-label="数据概览" className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "学生总数", value: stats.studentCount, icon: Users, tone: "text-emerald-700 bg-emerald-50" },
          { label: "当前在读", value: stats.activeCount, icon: GraduationCap, tone: "text-blue-700 bg-blue-50" },
          { label: "班级数量", value: stats.classCount, icon: BookOpen, tone: "text-amber-700 bg-amber-50" },
        ].map((item) => (
          <div key={item.label} className="border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-950">{item.value}</p>
              </div>
              <span className={`inline-flex size-10 items-center justify-center ${item.tone}`}>
                <item.icon aria-hidden="true" className="size-5" />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 border border-zinc-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-zinc-950">学生列表</h2>
            <p className="mt-1 text-xs text-zinc-500">共 {result.total} 条匹配记录</p>
          </div>
          <form className="flex w-full gap-2 sm:w-auto">
            <label className="relative min-w-0 flex-1 sm:w-72">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              />
              <span className="sr-only">搜索学生</span>
              <input
                name="keyword"
                defaultValue={keyword}
                placeholder="姓名、学号或邮箱"
                className="h-10 w-full border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <button
              type="submit"
              className="h-10 shrink-0 border border-zinc-300 bg-zinc-50 px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
            >
              搜索
            </button>
          </form>
        </div>

        {result.students.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold text-zinc-500">
                  <tr>
                    <th className="px-5 py-3">学生</th>
                    <th className="px-5 py-3">学号</th>
                    <th className="px-5 py-3">班级</th>
                    <th className="px-5 py-3">状态</th>
                    <th className="px-5 py-3 text-center">选课数</th>
                    <th className="px-5 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {result.students.map((student) => {
                    const status = statusMap[student.status];
                    return (
                      <tr key={student.id} className="transition hover:bg-zinc-50/80">
                        <td className="px-5 py-4">
                          <p className="font-medium text-zinc-950">{student.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{student.email}</p>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-zinc-700">{student.studentNo}</td>
                        <td className="px-5 py-4 text-zinc-700">
                          {student.schoolClass
                            ? `${student.schoolClass.grade} 级 ${student.schoolClass.name}`
                            : "未分班"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium ring-1 ring-inset ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center text-zinc-700">{student._count.enrollments}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/students/${student.id}/edit`}
                              title="编辑学生"
                              className="inline-flex size-8 items-center justify-center text-zinc-500 transition hover:bg-emerald-50 hover:text-emerald-700"
                            >
                              <Pencil aria-hidden="true" className="size-4" />
                              <span className="sr-only">编辑学生</span>
                            </Link>
                            <DeleteStudentButton action={deleteStudent.bind(null, student.id)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-zinc-100 md:hidden">
              {result.students.map((student) => {
                const status = statusMap[student.status];
                return (
                  <article key={student.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-zinc-950">{student.name}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium ring-1 ring-inset ${status.className}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-zinc-500">{student.email}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Link
                          href={`/students/${student.id}/edit`}
                          title="编辑学生"
                          className="inline-flex size-8 items-center justify-center text-zinc-500 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Pencil aria-hidden="true" className="size-4" />
                          <span className="sr-only">编辑学生</span>
                        </Link>
                        <DeleteStudentButton action={deleteStudent.bind(null, student.id)} />
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-xs text-zinc-400">学号</dt>
                        <dd className="mt-1 font-mono text-xs text-zinc-700">{student.studentNo}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-zinc-400">班级</dt>
                        <dd className="mt-1 text-zinc-700">
                          {student.schoolClass
                            ? `${student.schoolClass.grade} 级 ${student.schoolClass.name}`
                            : "未分班"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <Search aria-hidden="true" className="mx-auto size-8 text-zinc-300" />
            <p className="mt-4 font-medium text-zinc-800">没有找到学生</p>
            <p className="mt-1 text-sm text-zinc-500">请尝试更换关键词，或新增一名学生。</p>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-zinc-500">
            第 {result.page} / {result.pageCount} 页，共 {result.total} 人
          </p>
          <nav aria-label="分页" className="flex items-center gap-2">
            {result.page > 1 ? (
              <Link
                href={pageHref(keyword, result.page - 1)}
                className="inline-flex h-9 items-center gap-1.5 border border-zinc-300 px-3 font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                上一页
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1.5 border border-zinc-200 px-3 text-zinc-300">
                <ArrowLeft aria-hidden="true" className="size-4" />
                上一页
              </span>
            )}
            {result.page < result.pageCount ? (
              <Link
                href={pageHref(keyword, result.page + 1)}
                className="inline-flex h-9 items-center gap-1.5 border border-zinc-300 px-3 font-medium text-zinc-700 hover:bg-zinc-50"
              >
                下一页
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1.5 border border-zinc-200 px-3 text-zinc-300">
                下一页
                <ArrowRight aria-hidden="true" className="size-4" />
              </span>
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}
