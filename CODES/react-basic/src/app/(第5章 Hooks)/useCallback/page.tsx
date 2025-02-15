"use client";
import React from "react";

const Child = React.memo(function ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  console.log("Child render");
  return <input onChange={onChange} className="border" autoFocus />;
});

export default function Page() {
  const [text, setText] = React.useState("Hello, React.js!");

  // -- 优化后
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  return (
    <div>
      <p>Text: {text} </p>
      <Child onChange={handleChange} />
    </div>
  );
}
