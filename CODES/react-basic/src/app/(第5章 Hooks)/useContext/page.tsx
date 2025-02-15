"use client";
import React from "react";

// 1. 定义类型
type Payloads = {
  change_name: string;
  change_age: number;
};
type State = { name: string; age: number };
type Actions = {
  [Type in keyof Payloads]: Payloads[Type] extends undefined ? { type: Type } : { type: Type; payload: Payloads[Type] };
}[keyof Payloads];

// 2. 构造初始值
const initialState: State = { name: "Tom", age: 18 };

// 3. 定义 reducer 处理状态更新
const reducer: React.Reducer<State, Actions> = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "change_name":
      return { ...state, name: payload };
    case "change_age":
      return { ...state, age: payload };
    default:
      throw Error("未知 action: " + type);
  }
};



// 4. 创建上下文
type ProviderProps = {
  state: State;
  dispatch: React.Dispatch<Actions>;
};
const Context = React.createContext<ProviderProps>({} as ProviderProps);

// 5. 在根组件中使用 useReducer，将 state 和 dispatch 传递给上下文
export default function Page() {
  // -- 解构state，dispatch
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // -- 通过上下文将 state、dispatch 分发给子组件
  return (
    <Context.Provider value={{ state, dispatch }}>
      <Child />
    </Context.Provider>
  );
}

// 6. 子组件中通过 useContext 获取上下文的 state、dispatch
function Child() {
  const { state, dispatch } = React.useContext(Context);
  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <div className="space-x-4">
        <button onClick={() => dispatch({ type: "change_name", payload: "Jerry" })}>Change Name</button>
        <button onClick={() => dispatch({ type: "change_age", payload: 20 })}>Change Age</button>
      </div>
    </div>
  );
}
