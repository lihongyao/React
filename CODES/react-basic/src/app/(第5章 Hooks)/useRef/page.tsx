"use client";
import React, { useRef, useEffect, useState } from "react";

export default function Page() {
  // 1. 使用 ref 引用一个值
  const timer = useRef<number | null>(null);
  // 2. 使用 ref 引用一个 DOM 元素
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    timer.current = window.setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => {
      timer.current && window.clearInterval(timer.current);
    };
  }, []);

  return (
    <div>
      <p>当前时间：{currentTime}</p>
      <div className="space-x-4">
        <input ref={inputRef} className="border" />
        <button onClick={() => inputRef.current?.focus()}>Focus</button>
      </div>
    </div>
  );
}
