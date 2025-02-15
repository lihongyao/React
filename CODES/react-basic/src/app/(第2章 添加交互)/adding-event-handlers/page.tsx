"use client";

function Button() {
  // 1. 在 Button 组件 内部 声明一个名为 handleClick 的函数
  const handleClick = () => {
    // 2. 实现函数内部的逻辑（使用 alert 来显示消息）。
    alert("你点击了我！");
  };
  // 3. 添加 onClick={handleClick} 到 <button> JSX 中
  return <button onClick={handleClick}>点我</button>;
}

function AlertButton({ message, children }: { message: string; children: React.ReactNode }) {
  return <button onClick={() => alert(message)}>{children}</button>;
}

function ConfirmModal({ content, onConfirm, onCancel }: { content: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div>
      <div>{content}</div>
      <div>
        <button onClick={onCancel}>取消</button>
        <button onClick={onConfirm}>确定</button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="p-4">
      <Button />
      <div>
        <AlertButton message="正在播放！">播放电影</AlertButton>
        <AlertButton message="正在上传！">上传图片</AlertButton>
      </div>
      <ConfirmModal content="您确定要退出登录吗？" onConfirm={() => alert("点击确定")} onCancel={() => alert("点击取消")} />
    </div>
  );
}
