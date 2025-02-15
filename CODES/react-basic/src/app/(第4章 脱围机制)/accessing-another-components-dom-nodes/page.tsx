"use client";
import React, { useRef } from "react";

function Child({ ref }: { ref: React.RefObject<HTMLInputElement | null> }) {
  return <input ref={ref} />;
}
export default function Page() {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    ref.current?.focus();
  };
  return (
    <div>
      <Child ref={ref} />
      <button onClick={handleClick}>获取焦点</button>
    </div>
  );
}
