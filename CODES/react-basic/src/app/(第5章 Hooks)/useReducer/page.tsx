"use client";
import React, { useState } from "react";
import { useImmerReducer } from "use-immer";

// 1. 定义类型
type ItemProps = { id: number; text: string; done: boolean };
type State = Array<ItemProps>;
type Payloads = {
  added: { id: number; text: string };
  changed: { id: number; status: boolean };
  deleted: number;
};
type Actions = {
  [Type in keyof Payloads]: Payloads[Type] extends undefined ? { type: Type } : { type: Type; payload: Payloads[Type] };
}[keyof Payloads];

// 2. 构造初始值
const initialState: State = [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Learn TypeScript", done: false },
  { id: 3, text: "Learn Next.js", done: false },
];

// 3. 定义 reducer 处理状态更新
const reducer: React.Reducer<State, Actions> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "added":
      state.push({ id: payload.id, text: payload.text, done: false });
      return state;
    case "changed":
      const index = state.findIndex((item) => item.id === payload.id);
      state[index].done = payload.status;
      return state;
    case "deleted":
      return state.filter((item) => item.id !== payload);
    default:
      throw Error("未知 action: " + type);
  }
};

// 4. 在组建中调用
export default function Page() {
  const [text, setText] = useState("");

  // 4.1 使用 useReducer
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const handleInsert = () => {
    // 4.2 调用 dispatch 触发状态更新
    dispatch({ type: "added", payload: { id: Date.now(), text } });
    setText("");
  };
  const handleDelete = (id: number) => {
    dispatch({ type: "deleted", payload: id });
  };
  const handleEdit = (id: number, status: boolean) => {
    dispatch({ type: "changed", payload: { id, status } });
  };

  return (
    <div className="m-4 p-4 border border-gray-200 rounded">
      <h1>📒 张三的待办事项清单</h1>
      <div className="space-x-2 mt-2">
        <div className="flex items-center space-x-2 mb-4">
          <input className="border" type="text" value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={handleInsert}>添加</button>
        </div>
        <div>
          {/* 4.3 读取 state */}
          {state.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <input type="checkbox" checked={item.done} onChange={(e) => handleEdit(item.id, e.target.checked)} />
              <span className={item.done ? "text-gray-400 line-through" : "text-gray-600"}>{item.text}</span>
              <button className="text-red-500" onClick={() => handleDelete(item.id)}>
                删除
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
