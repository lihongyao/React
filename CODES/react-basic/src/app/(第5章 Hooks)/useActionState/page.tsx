"use client";
import { createUser } from "@/actions";
import React from "react";

export default function Page() {
  const [state, formAction, isPending] = React.useActionState(createUser, {});
  return (
    <div className="m-4">
      <form action={formAction} autoComplete="off" className="space-y-4 border p-4">
        <p>
          <label htmlFor="username" className="block">用户名：</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            className="border" 
            defaultValue={state.username} required 
          />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.usernameTips}
          </p>
        </p>
        <p>
          <label htmlFor="phone" className="block">手机号：</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="border" 
            defaultValue={state.phone} required maxLength={11}
          />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.phoneTips}
          </p>
        </p>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
          {isPending ? "加载中..." : "提交"}
        </button>
      </form>
    </div>
  );
}
