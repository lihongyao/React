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
  "h-11 w-full border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;

  return <p className="mt-1.5 text-xs text-red-600">{messages[0]}</p>;
}

export function StudentForm({ action, classes, student }: Props) {
  const [state, formAction, pending] = useActionState(action, initialStudentFormState);

  return (
    <form action={formAction} className="space-y-8">
      {state.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-800">
            学号 <span className="text-red-600">*</span>
          </span>
          <input
            className={inputClassName}
            name="studentNo"
            defaultValue={student?.studentNo}
            maxLength={32}
            placeholder="例如 S20260002"
            required
          />
          <FieldError messages={state.fieldErrors?.studentNo} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-800">
            姓名 <span className="text-red-600">*</span>
          </span>
          <input
            className={inputClassName}
            name="name"
            defaultValue={student?.name}
            maxLength={64}
            placeholder="输入学生姓名"
            required
          />
          <FieldError messages={state.fieldErrors?.name} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-800">
            邮箱 <span className="text-red-600">*</span>
          </span>
          <input
            className={inputClassName}
            name="email"
            type="email"
            defaultValue={student?.email}
            placeholder="name@example.com"
            required
          />
          <FieldError messages={state.fieldErrors?.email} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-800">手机号</span>
          <input
            className={inputClassName}
            name="phone"
            type="tel"
            defaultValue={student?.phone ?? ""}
            maxLength={32}
            placeholder="选填"
          />
          <FieldError messages={state.fieldErrors?.phone} />
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-2 block text-sm font-medium text-zinc-800">班级</span>
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
          <FieldError messages={state.fieldErrors?.schoolClassId} />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/students"
          className="inline-flex h-10 items-center justify-center gap-2 border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          返回列表
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center gap-2 bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="size-4" />
          )}
          {pending ? "保存中" : student ? "保存修改" : "保存学生"}
        </button>
      </div>
    </form>
  );
}
