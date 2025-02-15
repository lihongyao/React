import React from "react";

function Item({ text, completed }: { text: string; completed?: boolean }) {
  let itemContent = <>{text}</>;
  if (completed) {
    itemContent = <del>{text + "✅"}</del>;
  }
  return <div>{itemContent}</div>;
}

export default function Page() {
  return (
    <div className="p-2">
      <h1 className="text-2xl mb-2">Hero's Todo List</h1>
      <Item text="学习React.js" completed={true} />
      <Item text="掌握响应式原理" completed={true} />
      <Item text="完成两道算法题" completed={false} />
    </div>
  );
}
