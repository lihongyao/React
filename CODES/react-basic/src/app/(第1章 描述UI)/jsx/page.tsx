import React from "react";

export default function Page() {
  const name = "Tom";
  const color = "orange";
  const state = false;

  const getTime = () => new Date().toLocaleString();

  return (
    <div>
      {/* 当你想把一个字符串属性传递给 JSX 时，把它放到单引号或双引号中 */}
      <p className="cls">Hello,JSX!</p>
      {/* 插值 */}
      <p style={{ color }}>Hello,{name}！</p>
      {/* 表达式 */}
      <p>{state ? "✅" : "⭕️"}</p>
      {/* 调用方法 */}
      <p>{getTime()}</p>
    </div>
  );
}
