"use client";
import React from "react";

export default function Page() {
  const [count, setCount] = React.useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1);
      setCount(count + 2);
    }, 0);
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}
