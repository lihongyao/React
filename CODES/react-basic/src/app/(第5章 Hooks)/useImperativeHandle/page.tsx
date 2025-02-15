"use client";
import React from "react";

// 1. 定义类型
type HeroRefs = {
  version: string;
  focus: () => void;
};
type HeroProps = {
  ref: React.RefObject<HeroRefs | null>;
  description: string;
};

// 2. 使用 useImperativeHandle 暴露给父组件的方法
function Hero({ ref, ...props }: HeroProps) {
  React.useImperativeHandle(
    ref,
    () => ({
      /** 暴露属性 */
      version: "1.0.0",
      /** 暴露方法 */
      focus: () => {
        console.log("focus");
      },
    }),
    []
  );
  return <div>{props.description}</div>;
}

// 3. 在父组件中使用 ref 获取子组件的方法
export default function Page() {
  const heroRef = React.useRef<HeroRefs>(null);
  return (
    <div>
      <Hero ref={heroRef} description="Hello, React.js" />
      <button onClick={() => heroRef.current?.focus()}>focus</button>
      <button onClick={() => alert(heroRef.current?.version)}>get version</button>
    </div>
  );
}
