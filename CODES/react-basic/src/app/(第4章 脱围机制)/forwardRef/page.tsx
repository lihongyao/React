"use client";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface ChildRefs {
  version: string;
  focus: () => void;
  getValue: () => string | undefined;
}
interface ChildProps {
  message: string;
  ref: React.RefObject<ChildRefs | null>;
}

function Child({ ref, ...props }: ChildProps) {
  const internalRef = useRef<HTMLInputElement>(null);
  // -- 使用 useImperativeHandle 定义暴露给父组件的属性和方法
  useImperativeHandle(ref, () => ({
    version: "1.0.0",
    focus: () => internalRef.current?.focus(),
    getValue: () => internalRef.current?.value,
  }));
  return (
    <div>
      <p>{props.message}</p>
      <input ref={internalRef} placeholder="请输入" />
    </div>
  );
}

export default function Page() {
  const childRef = useRef<ChildRefs>(null);
  return (
    <div>
      <Child ref={childRef} message="Hello, React.js" />
      <button onClick={() => childRef.current?.focus()}>获取焦点</button>
      <button
        onClick={() => {
          console.log(childRef.current?.getValue());
        }}
      >
        读取数据
      </button>
    </div>
  );
}
