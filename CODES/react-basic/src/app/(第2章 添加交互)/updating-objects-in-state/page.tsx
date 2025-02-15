"use client";
import React from "react";
import { useImmer } from "use-immer";

function Form() {
  const [formData, updateFormData] = useImmer({
    firstName: "Barbara",
    lastName: "Hepworth",
    email: "lihy_online@163.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    updateFormData((draft) => {
      draft[e.target.name as keyof typeof formData] = e.target.value;
    });
  };

  return (
    <div>
      <form>
        <div>
          <label>First name：</label>
          <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label>Last name：</label>
          <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <label>Email：</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
      </form>
      <p>
        {formData.firstName} {formData.lastName}（{formData.email}）
      </p>
    </div>
  );
}

export default function Page() {
  return <Form />;
}
