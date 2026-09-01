"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title="删除学生"
      className="inline-flex size-8 items-center justify-center text-zinc-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <Trash2 aria-hidden="true" className="size-4" />
      )}
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
