"use client";
import React, { useCallback } from "react";

const Child = React.memo(function ({ text, onReset }: { text: string; onReset: () => void }) {
  console.log("Child render");
  return (
    <div>
      <h1>{text}</h1>
      <button onClick={onReset}>重置</button>
    </div>
  );
});

export default function Page() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState("Hello, React.js!");
  const handleReset = useCallback(() => {
    setText("Hello, React.js!");
  }, []);
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <br />
      <input className="border" onChange={(e) => setText(e.target.value)} />
      <Child text={text} onReset={handleReset} />
    </div>
  );
}
