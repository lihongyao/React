"use client";
import Image from "next/image";
import React, { Fragment } from "react";

function Avatar({ person, size = 80 }: { person: { id: number; name: string }; size?: number }) {
  return <Image src={`https://tailwindui.com/plus/img/avatar-${person.id}.jpg`} alt={person.name} width={size} height={size} />;
}

function Bar({ name, age }: { name: string; age: number }) {
  return (
    <p>
      {name} - {age}
    </p>
  );
}
function Hero({ id, ...props }: { id: number; name: string; age: number }) {
  return <Bar {...props} />;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="inline-block p-4 border rounded-lg">{children}</div>;
}

function Clock({ color, time }: { color: string; time: string }) {
  return <h1 style={{ color }}>{time}</h1>;
}

function Wrapper() {
  const [color, setColor] = React.useState("red");
  const [time, setTime] = React.useState(new Date().toLocaleTimeString());

  React.useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <p>
        <span>请选择一个颜色：</span>
        <select onChange={(e) => setColor(e.target.value)}>
          <option value="red">红色</option>
          <option value="green">绿色</option>
          <option value="blue">蓝色</option>
        </select>
      </p>
      <Clock color={color} time={time} />
    </>
  );
}

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex space-x-1">
        <Avatar person={{ id: 1, name: "Edwards1" }} />
        <Avatar person={{ id: 2, name: "Edwards2" }} />
        <Avatar person={{ id: 3, name: "Edwards3" }} />
      </div>
      <Hero id={1} name="周杰伦" age={30} />
      <Card>
        {/* <Avatar person={{ id: 1, name: "Edwards1" }} /> */}
        <p>Hello, China!</p>
      </Card>

      <Wrapper />
    </div>
  );
}
