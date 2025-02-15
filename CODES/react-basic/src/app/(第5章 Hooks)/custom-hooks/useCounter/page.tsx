"use client";

import React from "react";
import { useCounter, useInterval } from "@/hooks";

export default function Page() {
  const [delay, setDelay] = React.useState(1000);
  const count = useCounter(delay);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return (
    <>
      <p>Tick duration:{delay}ms </p>
      <input type="range" value={delay} min={10} max={2000} onChange={(e) => setDelay(e.target.valueAsNumber)} />
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
