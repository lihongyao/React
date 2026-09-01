# 目标

本章从空项目开始，使用 Next.js 16 App Router、Prisma ORM 7.10.0、PostgreSQL 搭建一个学生管理系统。

完成后可以：

- 管理班级和学生；
- 搜索、分页、新增、编辑、删除学生；
- 管理课程、选课和成绩；
- 使用 Prisma 查询、事务、聚合和原生 SQL。

主线先完成学生 CRUD。课程、成绩和统计放在最后，作为 Prisma API 的业务示例。

Prisma 的安装与 API 速查见 [《第13章 Nextjs 基础》中的 Prisma 模块](<./第13章 Nextjs 基础.md#prisma>)。

# 1. 创建 Next.js 项目

需要先安装 Node.js、pnpm 和 PostgreSQL。建议使用 Node.js 20.19+。

```shell
$ pnpm create next-app@latest student_mag_admin
$ cd student_mag_admin
```

Prisma 7 使用 ESM，设置项目类型：

```shell
$ pnpm pkg set type=module
```

安装依赖：

```shell
$ pnpm add @prisma/client@7.10.0 @prisma/adapter-pg pg dotenv server-only zod@4
$ pnpm add -D prisma@7.10.0 @types/node @types/pg tsx
```

如果 pnpm 提示 Prisma 的构建脚本被忽略，执行：

```shell
$ pnpm approve-builds
```

按 <kbd>a</kbd>，然后按 <kbd>Enter</kbd> 安装即可。

# 2. 准备 PostgreSQL

创建数据库：

```shell
createdb student_mag_admin
```

如果 `createdb` 不可用，也可以在 pgAdmin 或 `psql` 中执行：

```sql
CREATE DATABASE student_mag_admin;
```

初始化 Prisma：

```shell
pnpm exec prisma init --datasource-provider postgresql --output ../src/generated/prisma
```

> 提示：
>
> - `prisma init` 只负责初始化 Prisma 文件，不会生成 `src/generated/prisma/`。
>
> - `--output` 参数会把 Client 的目标路径写入 `prisma/schema.prisma` 的 `generator client`，真正生成代码要等定义好模型后执行 `pnpm exec prisma generate`。

这个命令会创建：

```text
prisma/schema.prisma
prisma.config.ts（有些 Prisma 7 版本会生成 prisma7.config.ts）
.env
```

在项目根目录的 `.env` 中配置数据库连接：

```ini
DATABASE_URL="postgresql://root:123456@localhost:5432/student_mag_admin?schema=public"
```

本章示例使用 PostgreSQL 账号 `root`、密码 `123456`。如果本机账号或端口不同，请相应修改连接字符串。`.env` 不要提交到 Git，也不要使用 `NEXT_PUBLIC_DATABASE_URL`。

# 3. 配置 Prisma

打开 Prisma 初始化生成的配置文件。如果文件名是 `prisma7.config.ts`，直接编辑这个文件，不要再新建一份配置。

先使用不含种子命令的配置：

```ts title="prisma.config.ts 或 prisma7.config.ts"
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

`prisma init` 不会创建 `prisma/seed.ts`，因此这里暂时不配置 `seed`。创建种子脚本后，再按第 6 节的说明补上。

# 4. 编写学生数据模型

系统使用四个模型：

```text
SchoolClass 1 ─── * Student
Student     1 ─── * Enrollment * ─── 1 Course
```

- `SchoolClass`：班级；
- `Student`：学生；
- `Course`：课程；
- `Enrollment`：学生与课程的选课关系，同时保存成绩。

用下面的内容覆盖 `prisma/schema.prisma`：

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client" // Prisma 7 的 Client 生成器
  output   = "../src/generated/prisma" // 相对于 prisma/schema.prisma
}

datasource db {
  provider = "postgresql" // 使用 PostgreSQL
}

// 学生状态由枚举约束，避免写入任意字符串
enum StudentStatus {
  ACTIVE
  SUSPENDED
  GRADUATED
}

// 班级
model SchoolClass {
  id        Int       @id @default(autoincrement()) // 自增主键
  name      String // 班级名称，例如“1班”
  grade     Int // 年级，例如 2026
  students  Student[] // 一个班级对应多个学生
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@unique([grade, name]) // 同一年级下班级名不能重复
}

// 学生
model Student {
  id            Int           @id @default(autoincrement()) // 自增主键
  studentNo     String        @unique // 学号，必须唯一
  name          String
  email         String        @unique // 邮箱，必须唯一
  phone         String? // ? 表示可选字段
  birthDate     DateTime?
  status        StudentStatus @default(ACTIVE) // 默认在读
  schoolClassId Int? // 未分班时为空
  schoolClass   SchoolClass?  @relation(fields: [schoolClassId], references: [id], onDelete: SetNull) // 删除班级时保留学生
  enrollments   Enrollment[] // 一个学生可以有多条选课记录
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([schoolClassId]) // 加速按班级查询
  @@index([status]) // 加速按状态查询
}

// 课程
model Course {
  id          Int          @id @default(autoincrement()) // 自增主键
  code        String       @unique // 课程编码，必须唯一
  name        String
  credits     Int          @default(1)
  enrollments Enrollment[] // 一门课程可以被多个学生选择
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

// 选课中间模型，同时保存成绩和选课时间
model Enrollment {
  id         Int      @id @default(autoincrement())
  studentId  Int
  courseId   Int
  score      Decimal? @db.Decimal(5, 2) // 成绩可为空，最多两位小数
  enrolledAt DateTime @default(now()) // 选课时间
  student    Student  @relation(fields: [studentId], references: [id], onDelete: Cascade) // 删除学生时删除选课记录
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade) // 删除课程时删除选课记录

  @@unique([studentId, courseId]) // 防止同一学生重复选择同一课程
  @@index([courseId]) // 加速按课程查询选课记录
}
```

关键约束：

| 写法 | 作用 |
| --- | --- |
| `@unique` | 字段值不能重复，例如学号、邮箱、课程编码 |
| `@@unique([studentId, courseId])` | 同一学生不能重复选择同一课程 |
| `@relation(..., onDelete: SetNull)` | 删除班级时保留学生，只清空班级 |
| `@relation(..., onDelete: Cascade)` | 删除学生或课程时删除对应选课记录 |

> 提示：建议安装 [Prisma ↪](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) 插件，获得语法高亮和提示。

# 5. 创建表并生成 Prisma Client

先格式化和校验 Schema：

```shell
$ pnpm exec prisma format
$ pnpm exec prisma validate
```

创建并应用迁移：

```shell
$ pnpm exec prisma migrate dev --name init
```

根据 Schema 生成 Client：

```shell
$ pnpm exec prisma generate
```

成功时会看到类似输出：

```text
Generated Prisma Client ... to ./src/generated/prisma
```

目录结构如下：

```text
prisma/
├── migrations/
│   └── <timestamp>_init/migration.sql
└── schema.prisma

src/generated/prisma/
└── client.ts
```

`migrate dev` 负责迁移数据库，`generate` 负责生成 TypeScript Client。即使迁移提示 `Already in sync`，也可以单独执行 `prisma generate`。

`src/generated/prisma/` 通常会加入 `.gitignore`，不会显示在 `git status` 中，但仍会生成在磁盘上。检查文件：

```shell
$ test -f src/generated/prisma/client.ts && echo "Prisma Client generated"
```

如果没有生成，确认当前目录是项目根目录，并检查 Schema 中的 `generator client` 和 `output`；也可以显式指定 Schema：

```shell
$ pnpm exec prisma generate --schema prisma/schema.prisma
```

# 6. 添加种子数据

种子脚本用于写入开发环境的初始数据。创建 `prisma/seed.ts`：

```ts title="prisma/seed.ts"
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
```

在 Prisma Config 的 `migrations` 中注册脚本：

```ts
migrations: {
  path: "prisma/migrations",
  seed: "tsx prisma/seed.ts",
},
```

执行种子脚本：

```shell
$ pnpm exec prisma db seed
$ pnpm exec prisma studio
```

`prisma db seed` 只会在显式执行时运行；Prisma 7 不会因为 `migrate dev` 自动执行它。脚本使用 `upsert`，可以重复执行。

# 7. 创建 Prisma Client 单例

开发环境热更新会反复执行模块。如果每次都 `new PrismaClient()`，可能创建过多数据库连接。创建 `src/lib/prisma.ts`：

```ts title="src/lib/prisma.ts"
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

这个模块只能被 Server Component、Server Action、Route Handler 或其他服务端模块导入。不要在带有 `"use client"` 的组件中导入它。

# 8. 实现学生查询

创建 `src/features/students/queries.ts`：

```ts title="src/features/students/queries.ts"
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
```

查询支持姓名、学号和邮箱。总数与当前页数据在同一个交互式事务中查询，并把超出范围的页码修正到最后一页，避免删除最后一页数据后出现空白页。

# 9. 校验表单并编写 Server Action

创建 `src/features/students/schema.ts`：

```ts title="src/features/students/schema.ts"
import { z } from "zod";

export const studentFormSchema = z.object({
  studentNo: z.string().trim().min(1, "请输入学号").max(32, "学号不能超过 32 个字符"),
  name: z.string().trim().min(1, "请输入姓名").max(64, "姓名不能超过 64 个字符"),
  email: z.string().trim().email("请输入有效邮箱"),
  phone: z.string().trim().max(32, "手机号不能超过 32 个字符").optional(),
  schoolClassId: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number().int().positive().optional(),
  ),
});

export type StudentFormFields = z.infer<typeof studentFormSchema>;

export type StudentFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof StudentFormFields, string[]>>;
};

export const initialStudentFormState: StudentFormState = { status: "idle" };
```

创建 `src/features/students/actions.ts`：

```ts title="src/features/students/actions.ts"
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
```

这里不再直接抛出表单错误，而是返回 `StudentFormState`，交给 React 19 的 `useActionState` 显示在表单中。Prisma 的 `P2002` 表示唯一约束冲突，用它分别提示学号或邮箱重复。生产项目还要在每个 Server Action 中加入登录和权限校验。

为了在提交中显示错误和加载状态，再安装图标库并创建客户端表单组件：

```shell
pnpm add lucide-react
```

```tsx title="src/features/students/student-form.tsx"
"use client";

import type { SchoolClass, Student } from "@/generated/prisma/client";
import {
  initialStudentFormState,
  type StudentFormState,
} from "@/features/students/schema";
import { AlertCircle, ArrowLeft, LoaderCircle, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

type StudentFormAction = (
  state: StudentFormState,
  formData: FormData,
) => Promise<StudentFormState>;

type Props = {
  action: StudentFormAction;
  classes: SchoolClass[];
  student?: Student;
};

const inputClassName =
  "h-11 w-full rounded border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function FieldError({ messages }: { messages?: string[] }) {
  return messages?.length ? (
    <p className="mt-1.5 text-xs text-red-600">{messages[0]}</p>
  ) : null;
}

export function StudentForm({ action, classes, student }: Props) {
  const [state, formAction, pending] = useActionState(action, initialStudentFormState);

  return (
    <form action={formAction} className="space-y-8">
      {state.status === "error" && (
        <div role="alert" className="flex gap-3 border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-medium">学号 *</span>
          <input className={inputClassName} name="studentNo" defaultValue={student?.studentNo} required />
          <FieldError messages={state.fieldErrors?.studentNo} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">姓名 *</span>
          <input className={inputClassName} name="name" defaultValue={student?.name} required />
          <FieldError messages={state.fieldErrors?.name} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">邮箱 *</span>
          <input className={inputClassName} name="email" type="email" defaultValue={student?.email} required />
          <FieldError messages={state.fieldErrors?.email} />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium">手机号</span>
          <input className={inputClassName} name="phone" defaultValue={student?.phone ?? ""} />
          <FieldError messages={state.fieldErrors?.phone} />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-medium">班级</span>
          <select
            className={inputClassName}
            name="schoolClassId"
            defaultValue={student?.schoolClassId?.toString() ?? ""}
          >
            <option value="">未分班</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.grade} 级 {schoolClass.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex justify-between border-t border-zinc-200 pt-6">
        <Link href="/students" className="inline-flex items-center gap-2 border px-4 py-2 text-sm">
          <ArrowLeft className="size-4" aria-hidden="true" /> 返回列表
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 bg-emerald-700 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "保存中" : student ? "保存修改" : "保存学生"}
        </button>
      </div>
    </form>
  );
}
```

列表中的删除按钮使用客户端组件，在提交前确认，并使用 `useFormStatus` 显示提交中的状态：

```tsx title="src/features/students/delete-student-button.tsx"
"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} title="删除学生">
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      <span className="sr-only">删除学生</span>
    </button>
  );
}

export function DeleteStudentButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("确认删除这名学生？相关选课记录也会一并删除。")) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton />
    </form>
  );
}
```

# 10. 创建学生列表页

将首页改为跳转到学生列表：

```tsx title="src/app/page.tsx"
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/students");
}
```

创建 `src/app/students/page.tsx`：

```tsx title="src/app/students/page.tsx"
import { deleteStudent } from "@/features/students/actions";
import { DeleteStudentButton } from "@/features/students/delete-student-button";
import { getStudents, getStudentStats } from "@/features/students/queries";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ keyword?: string; page?: string }>;
};

export default async function StudentsPage({ searchParams }: Props) {
  const params = await searchParams;
  const keyword = params.keyword?.trim() ?? "";
  const parsedPage = Number(params.page ?? "1");
  const page = Number.isInteger(parsedPage) ? parsedPage : 1;
  const [result, stats] = await Promise.all([
    getStudents(keyword, page),
    getStudentStats(),
  ]);

  return (
    <main>
      <header>
        <h1>学生管理</h1>
        <Link href="/students/new">新增学生</Link>
      </header>

      <p>学生总数：{stats.studentCount}，当前在读：{stats.activeCount}，班级数量：{stats.classCount}</p>

      <form>
        <input name="keyword" defaultValue={keyword} placeholder="姓名、学号或邮箱" />
        <button type="submit">搜索</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>学号</th>
            <th>姓名</th>
            <th>班级</th>
            <th>状态</th>
            <th>选课数</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {result.students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentNo}</td>
              <td>{student.name}</td>
              <td>
                {student.schoolClass
                  ? `${student.schoolClass.grade} 级 ${student.schoolClass.name}`
                  : "未分班"}
              </td>
              <td>{student.status}</td>
              <td>{student._count.enrollments}</td>
              <td>
                <Link href={`/students/${student.id}/edit`}>编辑</Link>
                <DeleteStudentButton action={deleteStudent.bind(null, student.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {result.students.length === 0 && <p>没有找到学生。</p>}

      <p>
        第 {result.page} / {result.pageCount} 页，共 {result.total} 人
      </p>
      <nav>
        {result.page > 1 && (
          <Link href={{ pathname: "/students", query: { keyword, page: result.page - 1 } }}>
            上一页
          </Link>
        )}
        {result.page < result.pageCount && (
          <Link href={{ pathname: "/students", query: { keyword, page: result.page + 1 } }}>
            下一页
          </Link>
        )}
      </nav>
    </main>
  );
}
```

Next.js 16 中页面的 `searchParams` 是 Promise，需要先 `await`。

# 11. 创建和编辑学生

创建 `src/app/students/new/page.tsx`：

```tsx title="src/app/students/new/page.tsx"
import { createStudent } from "@/features/students/actions";
import { getSchoolClasses } from "@/features/students/queries";
import { StudentForm } from "@/features/students/student-form";

export default async function NewStudentPage() {
  const classes = await getSchoolClasses();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">新增学生</h1>
      <p className="mt-2 text-sm text-zinc-500">创建学生档案并设置初始班级。</p>
      <section className="mt-8 border border-zinc-200 bg-white p-6">
        <StudentForm action={createStudent} classes={classes} />
      </section>
    </main>
  );
}
```

创建 `src/app/students/[id]/edit/page.tsx`：

```tsx title="src/app/students/[id]/edit/page.tsx"
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
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">编辑学生</h1>
      <p className="mt-2 text-sm text-zinc-500">
        正在编辑 {student.name}（{student.studentNo}）
      </p>
      <section className="mt-8 border border-zinc-200 bg-white p-6">
        <StudentForm
          action={updateStudent.bind(null, student.id)}
          classes={classes}
          student={student}
        />
      </section>
    </main>
  );
}
```

此时已经完成学生列表、搜索、分页、新增、编辑和删除。

# 12. Prisma 常用操作

下面的代码都在服务端模块中执行，例如 Server Action、Server Component 或 Route Handler。

## 创建记录

```ts
const student = await prisma.student.create({
  data: {
    studentNo: "S20260002",
    name: "李四",
    email: "lisi@example.com",
    schoolClassId: 1,
  },
});
```

## 查询记录

```ts
const students = await prisma.student.findMany({
  where: { status: "ACTIVE" },
  select: {
    id: true,
    studentNo: true,
    name: true,
    schoolClass: { select: { grade: true, name: true } },
  },
  orderBy: { studentNo: "asc" },
  take: 20,
});
```

常用查询方法：

| 方法 | 用途 |
| --- | --- |
| `findUnique` | 按唯一字段查询一条记录 |
| `findUniqueOrThrow` | 查不到时直接抛出异常 |
| `findFirst` | 按条件查询第一条 |
| `findMany` | 查询多条记录 |
| `count` | 统计数量 |
| `aggregate` | 求和、平均值、最大值、最小值 |
| `groupBy` | 按字段分组统计 |

## 更新和删除

```ts
await prisma.student.update({
  where: { studentNo: "S20260002" },
  data: { status: "GRADUATED" },
});

await prisma.student.updateMany({
  where: { status: "ACTIVE" },
  data: { status: "SUSPENDED" },
});

await prisma.student.delete({ where: { studentNo: "S20260002" } });
await prisma.student.deleteMany({ where: { status: "GRADUATED" } });
```

## 关系查询

```ts
const transcript = await prisma.student.findUniqueOrThrow({
  where: { studentNo: "S20260001" },
  select: {
    studentNo: true,
    name: true,
    schoolClass: { select: { grade: true, name: true } },
    enrollments: {
      select: {
        score: true,
        course: { select: { code: true, name: true, credits: true } },
      },
      orderBy: { course: { code: "asc" } },
    },
  },
});
```

## 课程、选课和成绩

```ts
const course = await prisma.course.create({
  data: { code: "CS102", name: "数据结构", credits: 3 },
});

async function enrollAndGrade(studentId: number, courseId: number) {
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId, courseId } },
    update: {},
    create: { studentId, courseId },
  });

  await prisma.enrollment.update({
    where: { studentId_courseId: { studentId, courseId } },
    data: { score: 95.5 },
  });
}

await enrollAndGrade(1, course.id);
```

`studentId_courseId` 来自 Schema 中的 `@@unique([studentId, courseId])`。

## 聚合统计

```ts
const [activeCount, scoreStats] = await prisma.$transaction([
  prisma.student.count({ where: { status: "ACTIVE" } }),
  prisma.enrollment.aggregate({
    _avg: { score: true },
    _max: { score: true },
    _min: { score: true },
    where: { score: { not: null } },
  }),
]);
```

## 事务

多个写操作必须全部成功或全部回滚时，使用事务：

```ts
async function createStudentAndEnroll(schoolClassId: number, courseId: number) {
  return prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        studentNo: "S20260003",
        name: "王五",
        email: "wangwu@example.com",
        schoolClassId,
      },
    });

    const enrollment = await tx.enrollment.create({
      data: { studentId: student.id, courseId },
    });

    return { student, enrollment };
  });
}

const result = await createStudentAndEnroll(1, 1);
```

事务中不要执行外部 HTTP 请求或长时间计算。

## 原生 SQL

确实需要 PostgreSQL 特有能力时使用参数化 SQL：

```ts
const prefix = "S2026";
const students = await prisma.$queryRaw<
  { id: number; studentNo: string; name: string }[]
>`
  SELECT "id", "studentNo", "name"
  FROM "Student"
  WHERE "studentNo" LIKE ${`${prefix}%`}
  ORDER BY "studentNo" ASC
`;
```

不要使用字符串拼接组装 SQL。

# 13. 需要 HTTP API 时

Server Component 可以直接调用 Prisma，不需要请求自己的 API。只有浏览器端、移动端或第三方系统需要 HTTP 接口时，才创建 Route Handler。

创建 `src/app/api/students/route.ts`：

```ts title="src/app/api/students/route.ts"
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
```

公开接口必须增加身份认证、权限校验、限流和错误处理。

# 14. 运行项目

完成文件创建后执行：

```shell
$ pnpm exec prisma validate
$ pnpm exec prisma migrate status
$ pnpm exec prisma generate
$ pnpm build
$ pnpm dev
```

访问 `http://localhost:3000/students`，检查：

1. 页面能显示 `prisma db seed` 写入的张三；
2. 搜索姓名、学号或邮箱能过滤列表；
3. 新增、编辑、删除后列表会刷新，重复学号或邮箱会显示表单错误；
4. 删除学生前会弹出确认，对应选课记录会级联删除；
5. 在手机宽度下列表会切换为学生卡片布局。

# 常见问题

| 现象 | 处理方式 |
| --- | --- |
| `No seed command configured` | 在 Config 的 `migrations` 中添加 `seed: "tsx prisma/seed.ts"`，确认 `prisma/seed.ts` 存在 |
| `DATABASE_URL` 未找到 | 确认 `.env` 在项目根目录，Config 顶部有 `import "dotenv/config"` |
| `Already in sync` | 表示数据库已经与迁移同步，不是错误；需要 Client 时另执行 `prisma generate` |
| 看不到 `src/generated/prisma` | 检查 `generator client.output`，并直接执行 `test -f src/generated/prisma/client.ts`；该目录通常被 Git 忽略 |
| `EPERM: uv_cwd` | 当前终端目录已不存在或无权限，先 `cd` 到项目目录再执行 pnpm 命令 |
| 连接 PostgreSQL 失败 | 检查数据库是否启动、端口和用户名密码是否与 `DATABASE_URL` 一致 |

生成的 Prisma Client 不要手动修改，也不要从客户端组件导入；修改 Schema 后重新执行 `prisma migrate dev` 和 `prisma generate`。
