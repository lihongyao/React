"use client";
import React, { useRef } from "react";

export default function Page() {
  const count = useRef(0);
  const handleClick = () => {
    count.current += 1;
    console.log(count.current);
  };
  return (
    <div>
      <button onClick={handleClick}>点击</button>
    </div>
  );
}
