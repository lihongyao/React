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
