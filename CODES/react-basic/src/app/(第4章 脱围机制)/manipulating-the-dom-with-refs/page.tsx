"use client";
import React, { useEffect } from "react";

export default function Page() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={wrapperRef}>
      <input ref={inputRef} placeholder="Search" />
      <button onClick={() => wrapperRef.current?.scrollIntoView({ behavior: "smooth" })}>返回顶部</button>
    </div>
  );
}
