"use client";
import React from "react";

export default function Page() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    // -- 触发状态更新
    setCount(count + 1);
    // -- 仍然输出旧的 count 值
    console.log(count);
  };
  return (
    <div>
      <button onClick={handleClick}>Count: {count}</button>
    </div>
  );
}
