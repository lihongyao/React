"use client";
import React from "react";

function Input({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <fieldset className=" border border-black p-4 m-4">
      <legend>Please enter message：</legend>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </fieldset>
  );
}

export default function Page() {
  const [value, setValue] = React.useState("");

  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <div>
      <Input value={value} onChange={handleChange} />
      <Input value={value} onChange={handleChange} />
    </div>
  );
}


