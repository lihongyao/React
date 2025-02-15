"use client";
import React, { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You Click the Button {count /** 读取 State */} times.</p>
      <button onClick={() => setCount(count + 1)} /** 更新 State */>Tap Here.</button>
    </div>
  );
}
