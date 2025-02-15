"use client";
import React from "react";

function Pagination() {
  // 1. 定义一个状态，用于存储当前页码
  const [current, setCurrent] = React.useState(1);

  // 2. 定义一个函数，用于更新当前页码
  const handleClick = () => {
    setCurrent((prev) => prev + 1);
  };
  return (
    <div>
      <p>当前页码：{current}</p>
      <button onClick={handleClick}>下一页</button>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <Pagination />
    </div>
  );
}


