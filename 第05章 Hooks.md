# 概述

> @See https://zh-hans.react.dev/reference/react/hooks

在 React 中，以 `use` 开头命名的函数被称为 **[Hook](https://zh-hans.react.dev/reference/react)**。

Hook 是 React 16.8 引入的特性，**Hook** 使得在组件中使用 React 的功能变得更加便捷。你可以使用内置的 Hook，也可以创建自定义 Hook 来满足特殊需求。

# API

## State Hook

### useState

> @See https://zh-hans.react.dev/reference/react/useState

用于在函数组件中添加**状态（state）**。它返回一个**状态值**和一个**更新该状态的函数**，使组件能够在用户交互或其他操作时更新 UI。

**语法形式**：

```jsx
const [state, setState] = useState(initialState)
```

- `state`：当前状态值。
- `setState`：用于更新状态的函数，调用时会触发组件重新渲染。
- `initialState`：状态的初始值，可以是**任何类型**，如 string、number、boolean、object、array 或**函数**。

**语法解读**：

- **定义状态**：调用 useState 时传入初始值，React 会返回一个**状态变量**和**更新状态的函数**。
- **更新状态**：调用 setState(newValue)，React 会**重新渲染组件**，并使用新值替换旧值。
- **惰性初始化**：如果 initialState 是一个函数，React 只会在**组件首次渲染时调用它**，适用于计算开销较大的初始值。

**代码示例**

**🔵 基本使用**

```jsx
export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

**解析：**

- count 作为状态变量，初始值为 0。
- setCount 用于更新 count，每次点击按钮都会触发重新渲染。

**🔵 处理对象状态**

```tsx
import { useState } from "react";

interface User {
  name: string;
  age: number;
}

export default function UserProfile() {
  const [user, setUser] = useState<User>({ name: "Alice", age: 25 });

  return (
    <div>
      <p>姓名：{user.name}</p>
      <p>年龄：{user.age}</p>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>增长年龄</button>
    </div>
  );
}
```

**解析：**

- user 是一个对象状态。
- setUser 不能直接修改 user，需要使用**扩展运算符 (...)** 复制原对象并更新部分属性。

**🔵 使用函数更新（获取最新 state）**

```tsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
    </div>
  );
}
```

**解析：**

- setCount(prev => prev + 1) 确保**基于最新 state 进行更新**，避免闭包问题。

**🔵 惰性初始化（仅初始化时执行）**

```tsx
import { useState } from "react";

function computeInitialValue(): number {
  console.log("计算初始值...");
  return 100;
}

export default function Counter() {
  const [count, setCount] = useState<number>(() => computeInitialValue());

  return (
    <div>
      <p>当前计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**解析：**

- useState(() => computeInitialValue()) **仅在首次渲染时调用 computeInitialValue**，不会在组件更新时重复执行。

> 📖 **总结**

- useState 用于在函数组件中管理状态。
- setState **不能直接修改对象或数组**，要使用**不可变数据（immutability）** 方式更新。
- 使用**函数式更新**避免 setState 的闭包问题。
- 惰性初始化适用于计算开销较大的初始值。

### useReducer

@See https://zh-hans.react.dev/reference/react/useReducer

useReducer 提供了一种替代 useState 的方式，特别适用于包含多个子值或需要根据特定操作类型更新的复杂 state 对象。

**语法形式：**

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?);
```

**参数解读：**

- `reducer`：一个纯函数，接收当前的 state 和 action，返回新的 state。
- `initialArg`：初始化 state 的值。
- `init?`：一个函数，用于懒初始化 state。

**返回值：**

- `state`：当前的 state。
- `dispatch`：分发 action 的函数，用于触发 state 更新。

**🔵 代码示例：**

```react
import { ChangeEvent, Reducer, useReducer } from "react";

// 1. 定义类型
type State  = { name: string; age: number };
type Action = 
  { type: "CHANGE_NAME"; payload: string } | 
  { type: "INCREMENT_AGE" } | 
  { type: "DECREMENT_AGE" };

// 2. 构造初始值
const initialState: State = { name: "张三", age: 18 };

// 3. 定义 reducer 处理状态更新
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "CHANGE_NAME":
      return { ...state, name: action.payload };
    case "INCREMENT_AGE":
      return { ...state, age: state.age + 1 };
    case "DECREMENT_AGE":
      return { ...state, age: state.age - 1 };
    default:
      return state;
  }
};

// 4. 在组件中调用 reducer
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_NAME", payload: e.target.value });
  };

  return (
    <div>
      <p>
        <strong>name：</strong>
        {state.name}
      </p>
      <p>
        <strong>age：</strong>
        {state.age}
      </p>
      <div>
        <input className="border" type="text" placeholder="Please enter name." onChange={handleNameChange} />
        <button onClick={() => dispatch({ type: "INCREMENT_AGE" })}>INCREMENT</button>
        <button onClick={() => dispatch({ type: "DECREMENT_AGE" })}>DECREMENT</button>
      </div>
    </div>
  );
}
```

上述示例中，定义 action 类型过于繁琐，我们可以继续优化类型判断：

```typescript
type Payloads = {
  CHANGE_NAME: string;
  INCREMENT_AGE: undefined;
  DECREMENT_AGE: undefined;
};
type Actions = {
  [Type in keyof Payloads]: Payloads[Type] extends undefined
    ? { type: Type }
    : { type: Type; payload: Payloads[Type] };
}[keyof Payloads];
```

上面代码定义了一种优雅的方法来生成 Actions 的类型，它动态生成了一组了看和类型。接下来将为您逐步解读代码

1️⃣ 定义 Payloads 对象**

```ts
type Payloads = {
  CHANGE_NAME: string;
  INCREMENT_AGE: undefined;
  DECREMENT_AGE: undefined;
};
```

Payloads 是一个类型对象，它定义了每个动作的 type 和其可能的 payload 数据类型。

- CHANGE_NAME 动作需要一个 string 类型的 payload。
- INCREMENT_AGE 和 DECREMENT_AGE 动作不需要 payload，用 undefined 表示。

2️⃣  **定义 Actions 类型**

```ts
type Actions = {
  [Type in keyof Payloads]: Payloads[Type] extends undefined
    ? { type: Type }
    : { type: Type; payload: Payloads[Type] };
}[keyof Payloads];
```

这是一个映射类型，逐步拆解如下：

**a. 映射类型生成动作对象**

```ts
{
  [Type in keyof Payloads]: Payloads[Type] extends undefined
    ? { type: Type }
    : { type: Type; payload: Payloads[Type] };
}
```

- `Type in keyof Payloads`: 遍历 Payloads 中的键（即 CHANGE_NAME、INCREMENT_AGE、DECREMENT_AGE）。
- `Payloads[Type] extends undefined`: 检查 Payloads[Type]（即 string 或 undefined）。
  - 如果 Payloads[Type] 是 undefined，生成 { type: Type }。
  - 否则，生成 { type: Type; payload: Payloads[Type] }。

生成的中间结果类似于：

```ts
{
  CHANGE_NAME: { type: "CHANGE_NAME"; payload: string };
  INCREMENT_AGE: { type: "INCREMENT_AGE" };
  DECREMENT_AGE: { type: "DECREMENT_AGE" };
}
```

**b. 提取键值类型生成联合类型**

```ts
...[keyof Payloads]
```

[keyof Payloads] 提取上面生成对象的值类型，构成联合类型：

```tsx
type Actions =
  | { type: "CHANGE_NAME"; payload: string }
  | { type: "INCREMENT_AGE" }
  | { type: "DECREMENT_AGE" };
```

**🔵 综合示例 ——  待办事项清单**

@See https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer

![](./imgs/useReducer_with_immer.gif)

这里基于 immer 库来简化 reducer 的更新

```shell
$ pnpm add use-immer
```

代码示例：

```tsx
import { Reducer, useState } from "react";
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
const reducer: Reducer<State, Actions> = (state, action) => {
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
export default function App() {
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
              <input 
                type="checkbox" 
                checked={item.done} 
                onChange={(e) => handleEdit(item.id, e.target.checked)} 
              />
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

```

> 温馨提示：关于 `useReducer` 的更多用法，请参考 [官方指南 >>](https://zh-hans.react.dev/reference/react/useReducer)

## Context Hook

### useContext 

@See https://zh-hans.react.dev/reference/react/hooks#context-hooks

useContext 用于在函数组件中访问 Context（上下文）的值，避免了在组件树中逐层传递 props 的繁琐。

**语法形式**：

```tsx
const value = useContext(MyContext);
```

**语法解读：**

- MyContext 是通过 React.createContext 创建的 Context 对象。
- useContext 接受这个 Context 对象作为参数，并返回由上层组件最近的 <MyContext.Provider> 提供的 value 值。
- 如果没有找到对应的 Provider，useContext 会返回 Context 创建时的默认值。

**🔵 综合示例 —— 结合useReducer 实现 TodoList ** 

![](./imgs/todolist_context_and_reducer.gif)

目录结构：

```
src/
 ├── components/
 │    ├── TodoForm.tsx
 │    ├── TodoList.tsx
 ├── context/
 │    ├── TodoContext.tsx
 ├── App.tsx
 ├── main.tsx
```

> **` @/context/TodoContext.tsx`**

```tsx
import React, { createContext, useReducer, useContext, ReactNode } from "react";

// -- 定义 Todo 类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// -- 定义 Reducer 可执行的动作
type Action = 
  { type: "ADD_TODO"; payload: string } | 
  { type: "TOGGLE_TODO"; payload: number } | 
  { type: "REMOVE_TODO"; payload: number };

// -- Reducer 逻辑
const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case "TOGGLE_TODO":
      return state.map((todo) => (todo.id === action.payload ? { 
        ...todo, completed: !todo.completed 
      } : todo));
    case "REMOVE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

// -- 创建 Context
const TodoContext = createContext<
  | {
      todos: Todo[];
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

// -- 提供 Context 的 Provider
export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return <TodoContext.Provider value={{ todos, dispatch }}>{children}</TodoContext.Provider>;
};

// -- 自定义 Hook
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};

```

> **`@/components/TodoForm.tsx`**

```tsx
import React, { useState } from "react";
import { useTodo } from "@/context/TodoContext";

export default function TodoForm() {
  const [text, setText] = useState("");
  const { dispatch } = useTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch({ type: "ADD_TODO", payload: text });
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        className="border p-2 rounded-md w-full" 
        placeholder="输入待办事项..." 
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
        添加
      </button>
    </form>
  );
}
```

> **`@/components/TodoList.tsx`**

```tsx
import { useTodo } from "@/context/TodoContext";

export default function TodoList() {
  const { todos, dispatch } = useTodo();
  return (
    <ul className="p-4 space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
          <span 
            onClick={() => dispatch({ type: "TOGGLE_TODO", payload: todo.id })} 
            className={`cursor-pointer ${todo.completed ? "line-through text-gray-400" : ""}`}
          >
            {todo.text}
          </span>
          <button 
            onClick={() => dispatch({ type: "REMOVE_TODO", payload: todo.id })} 
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            删除
          </button>
        </li>
      ))}
    </ul>
  );
}
```

> **`@/App.tsx`**

```tsx
import { TodoProvider } from "@/context/TodoContext";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function App() {
  return (
    <TodoProvider>
      <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded-md">
        <h1 className="text-2xl font-bold text-center mb-4">Todo List</h1>
        <TodoForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
}
```

## Ref Hook

在 React 中，ref 充当**“逃逸机制”**，用于[存储不影响渲染的数据](https://zh-hans.react.dev/learn/referencing-values-with-refs)，如 DOM 节点或计时器 ID。与状态不同，更新 ref **不会触发组件重新渲染**，通常用于与浏览器 API 或其他非 React 系统交互。

- 使用 [useRef](https://zh-hans.react.dev/reference/react/useRef) 声明 ref，可存储任意值，最常见的用途是**引用 DOM 元素**。
- 使用 [useImperativeHandle](https://zh-hans.react.dev/reference/react/useImperativeHandle) **自定义组件对外暴露的 ref**，但实际使用场景较少。

### useRef

@See https://zh-hans.react.dev/reference/react/useRef

useRef 用于在函数组件中引用一个不会引起重新渲染的值。它返回一个包含 current 属性的对象，可以用来存储对 DOM 元素的引用或任何可变数据。

**语法形式：**

```tsx
const ref = useRef<T>(initialValue);1
```

语法解读：

- `T`：指定 ref 对象的类型。

- `initialValue`：ref 对象的初始值。

**语法解读：**

- 调用 useRef 时，传入一个初始值，React 会返回一个包含 current 属性的对象。
- ref.current 可以用来访问或修改存储的值。
- 修改 ref.current 的值不会触发组件的重新渲染。

**代码示例**：

**🔵 访问 DOM 元素：**

```tsx
import { useEffect, useRef } from "react";

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 组件挂载后聚焦输入框
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

**🔵 存储可变数据：**

```tsx
import { useRef } from "react";

export default function App() {
  const countRef = useRef<number>(0);

  const increment = () => {
    countRef.current += 1;
    console.log(countRef.current);
  };

  return (
    <div>
      <p>Count: {countRef.current}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

**注意事项：**

1. useRef 返回的对象在组件的整个生命周期内保持不变。
2. 修改 ref.current 的值不会触发组件重新渲染。
3. useRef 适用于访问 DOM 元素或存储在渲染之间保持的可变数据，但不用于需要触发渲染的状态。

### useImperativeHandle

@See https://zh-hans.react.dev/reference/react/useImperativeHandle

useImperativeHandle 用于在函数组件中自定义通过 ref 暴露给父组件的实例值或方法。它通常与 forwardRef 一起使用，以便在父组件中访问子组件的特定功能。

**语法形式：**

```tsx
useImperativeHandle(ref, createHandle, [dependencies]);
```

**语法解读：**

- `ref`：父组件传入的 ref 对象，通过它暴露子组件的实例或方法。
- `createHandle`：一个函数，返回一个对象，该对象包含希望暴露给父组件的方法或属性。
- `dependencies?`：可选的依赖数组，createHandle 中使用的变量发生变化时，createHandle 会重新执行。

> **温馨提**示：
>
> 从 **React <sup>19</sup>** 开始，可以 [直接将 ref 作为子组件的一个普通 prop 传递](https://zh-hans.react.dev/blog/2024/12/05/react-19#ref-as-a-prop)，无需再依赖 forwardRef 来显式传递 ref。
>
> 在 **React <sup>18</sup> **以前，ref 是一个特殊的属性，无法直接作为 prop 传递给子组件，因此必须使用 forwardRef 包裹子组件。

**🔵 综合示例**

```tsx
import { RefObject, useImperativeHandle, useRef } from "react";

// 1. 定义类型
type HeroRefs = {
  version: string;
  focus: () => void;
};

// 2. 使用 useImperativeHandle 暴露给父组件的方法
function Hero({ ref, ...props }: { ref: RefObject<HeroRefs | null>; description: string }) {
  useImperativeHandle(
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
export default function App() {
  const heroRef = useRef<HeroRefs>(null);
  return (
    <div>
      <Hero ref={heroRef} description="Hello, React.js" />
      <button onClick={() => heroRef.current?.focus()}>focus</button>
      <button onClick={() => alert(heroRef.current?.version)}>get version</button>
    </div>
  );
}
```

**注意事项：**

1. **避免滥用 ref。** 只有在无法通过 prop 表达*命令式*行为时，才应使用 ref，例如：滚动到特定节点、聚焦某个元素、触发动画或选择文本等。
2. **尽量使用 prop，避免使用 ref。** 如果能通过 prop 实现功能，就不应使用 ref。例如，避免在 Modal 组件中暴露 {open, close} 这样的命令式方法，最好采用 \<Modal isOpen={isOpen} /> 的方式，将 isOpen 作为 prop 传递。可以通过 [副作用](https://zh-hans.react.dev/learn/synchronizing-with-effects) 来控制并暴露命令式行为。

## Effect Hook

Effect Hook 允许组件与外部系统（如网络、浏览器、DOM 等非 React 代码）进行交互并保持同步。它是 React 中的一种**“逃逸机制”**，不建议用它来协调应用的数据流。如果没有与外部系统交互的需求，可以不使用它。

useEffect 还有两个不常用的变体，它们的执行时机有所不同：

- useLayoutEffect：在浏览器重绘屏幕前执行，适合在此阶段进行布局测量。
- useInsertionEffect：在 React 修改 DOM 前触发，常用于库中插入动态 CSS。

### useEffect

@See https://zh-hans.react.dev/reference/react/useEffect

useEffect 使你能够在组件渲染后执行副作用操作，并控制这些操作的执行时机和频率。

**语法形式：**

```tsx
useEffect(setup, dependencies?)
```

**语法解读：**

- `setup`：执行副作用的函数。可选择返回一个 **清理函数**（cleanup）。React 在组件挂载时运行 setup。如果依赖项变更，React 会先运行旧的清理函数（如果存在），然后运行新的 setup。在组件卸载时，React 会最后一次运行清理函数。
- `dependencies?`：一个数组，列出 setup 中使用的所有响应式值（如 props、state 以及组件内部声明的变量和函数）。React 使用 Object.is 比较依赖项的新旧值，决定是否重新运行 setup。依赖项数组必须固定，并以 [dep1, dep2] 的形式内联编写。如果省略，setup 在每次组件重新渲染时都会重新执行。

**🔵 基础示例 —— 链接到外部系统 **

有些组件需要与网络、某些浏览器 API 或第三方库保持连接，当它们显示在页面上时。这些系统不受 React 控制，所以称为外部系统。

> 监听全局的浏览器事件 

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    // 监听鼠标移动事件
    document.addEventListener("mousemove", updateMouse);
    return () => {
      // 移除监听
      document.removeEventListener("mousemove", updateMouse);
    };
  }, []);
  return (
    <div
      className="w-10 h-10 rounded-full bg-blue-500 pointer-events-none absolute"
      style={{
        transform: `translate(${position.x - 20}px, ${position.y - 20}px)`,
      }}
    />
  );
}
```

> 温馨提示：关于链接到外部系统的示例，请参考 [这里 >>](https://zh-hans.react.dev/reference/react/useEffect#examples-connecting)

**🔵 数据请求**

```tsx
import { useEffect, useState } from "react";

export default function App() {
  const [userId, setUserId] = useState(1);
  const [data, setData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const json = await response.json();
      if (!ignore) setData(json);
    })();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <div className="p-4">
      <p>Name: {data?.name}</p>
      <p>Email: {data?.email}</p>
      <button className="border mt-2 px-4 bg-blue-500 text-white" onClick={() => setUserId(userId + 1)}>
        Next
      </button>
    </div>
  );
}
```

> 注意，`ignore` 变量被初始化为 `false`，并且在 cleanup 中被设置为 `true`。这样可以确保 [你的代码不会受到“竞争条件”的影响](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)：网络响应可能会以与你发送的不同的顺序到达。

**🔵 指定响应式依赖项**

**你无法“选择” Effect 的依赖项**。Effect 代码中使用的每个 **响应式值** 都必须声明为依赖项。

响应式值 **包括 props 和直接在组件内声明的所有变量和函数**。

如果 Effect 的代码不使用任何响应式值，则其依赖项列表应为空（`[]`）。

> 关于 `useEffect` 的更多用法，请参考 [这里 >>](https://zh-hans.react.dev/reference/react/useEffect#usage)

### useLayoutEffect

@See https://zh-hans.react.dev/reference/react/useLayoutEffect

useLayoutEffect 用于在浏览器绘制屏幕之前同步执行副作用操作。与 useEffect 类似，但 useLayoutEffect 会在所有 **DOM 变更之后、浏览器绘制之前同步调用**，这使得它适用于需要读取布局并同步触发重渲染的场景，例如测量元素尺寸或位置。

> 提示：大多数的场景中都应该使用 useEffect 来实现我们的逻辑，仅仅在一些特殊情况，比如需要去监听同步更新状态防止页面闪动时才需要 useLayoutEffect。

**语法形式：**

```tsx
useLayoutEffect(() => {
  // 副作用代码

  return () => {
    // 清理函数（可选）
  };
}, [dependencies]);
```

**语法解读：**

- useLayoutEffect：Hook 本身。
- () => { ... }：在组件渲染后同步执行的副作用函数。
- [dependencies]：可选的依赖数组，只有当数组中的值发生变化时，副作用函数才会重新执行。如果省略此参数，副作用函数将在每次渲染后执行。

**注意事项：**

1. useLayoutEffect 只能在组件的顶层或自定义 Hook 中调用，不能在循环或条件语句中调用。
2. 在服务端渲染中，useLayoutEffect 不会执行，因此在使用时需要注意兼容性。
3. 过度使用 useLayoutEffect 可能导致性能问题，建议在确实需要同步读取布局或触发重渲染的情况下使用，其他情况优先考虑使用 useEffect。

**代码示例：**

```tsx
import { useLayoutEffect, useRef, useState } from "react";

export default function App() {
  const [width, setWidth] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, []);

  return (
    <div>
      <div ref={divRef} style={{ width: "50%" }}>
        This div's width is {width}px.
      </div>
    </div>
  );
}
```

在上述示例中：

1. 使用 useState 创建 width 状态，用于存储 div 元素的宽度。
2. 使用 useRef 创建 divRef，用于引用 DOM 元素。
3. 在 useLayoutEffect 中，访问 divRef.current 获取 DOM 元素，并设置其宽度到 width 状态。由于 useLayoutEffect 在 DOM 更新后、浏览器绘制前执行，确保了在绘制之前获取到最新的布局信息。

**与 useEffect 的区别：**

- useLayoutEffect 会在 DOM 更新后、浏览器绘制前同步执行副作用，可能会阻塞浏览器绘制。适用于需要同步读取布局或触发重渲染的场景。
- useEffect 会在浏览器绘制完成后异步执行副作用，不会阻塞绘制。适用于大多数副作用操作，如数据获取、订阅等。

## 性能 Hook

在介绍这些 Hooks 的作用之前，我们先来回顾一下React 中的性能优化（避免组件内重渲染）：

- shouldComponentUpdate：对比nextProps 和 props决定要不要更新
- class 组件：pureComponent 
- Function组件：memo

优化重新渲染性能的一种常见方法是跳过不必要的工作。例如，可以告诉 React 重用缓存的计算结果，或者如果数据自上次渲染以来没有更改，则跳过重新渲染。

可以使用以下 Hook 跳过计算和不必要的重新渲染：

1. 使用 useMemo 缓存计算代价昂贵的计算结果。
2. 使用 useCallback 将函数传递给优化组件之前缓存函数定义。

有时由于屏幕确实需要更新，无法跳过重新渲染。在这种情况下，可以通过将必须同步的阻塞更新（比如使用输入法输入内容）与不需要阻塞用户界面的非阻塞更新（比如更新图表）分离以提高性能。

使用以下 Hook 处理渲染优先级：

- [`useTransition`](https://zh-hans.react.dev/reference/react/useTransition) 允许将状态转换标记为非阻塞，并允许其他更新中断它。
- [`useDeferredValue`](https://zh-hans.react.dev/reference/react/useDeferredValue) 允许延迟更新 UI 的非关键部分，以让其他部分先更新。

### useMemo

@See https://zh-hans.react.dev/reference/react/useMemo

useMemo 在每次重新渲染的时候能够缓存 **计算的结果**。

**语法形式：**

```tsx
const cachedValue = useMemo(calculateValue, dependencies)
```

**语法解读：**

- `calculateValue`：是一个无参纯函数，用于计算缓存值。首次渲染时会调用，之后仅在 dependencies 变化时重新执行，并返回最新结果，缓存供下次使用。
- `dependencies`：是 calculateValue 中使用的响应式变量（如 props、state）组成的数组，需写为固定形式 [dep1, dep2]。React 使用 Object.is 比较每个依赖项的新旧值，决定是否重新计算。

**返回值：**

- 在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果。

- 在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果。

**🔵 基础示例**

```tsx
import { useMemo } from "react";

const todos = [
  { id: 1, text: "Learn React", done: true },
  { id: 2, text: "Learn Vue", done: true },
  { id: 3, text: "Learn Angular", done: false },
  { id: 4, text: "Learn Svelte", done: false },
  { id: 5, text: "Learn Next.js", done: false },
  { id: 6, text: "Learn Nuxt.js", done: true },
  { id: 7, text: "Learn Remix", done: true },
  { id: 8, text: "Learn Astro", done: false },
  { id: 9, text: "Learn SvelteKit", done: true },
];

export default function App() {
  const filteredTodos = useMemo(() => todos.filter((todo) => todo.done), [todos]);
  return <div> ... </div>;
}
```

**🔵 跳过组件的重新渲染**

**默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件**，我们来看一组示例：

```tsx
import { useState } from "react";

const Child = function ({ text }: { text: string }) {
  console.log("Child render");
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
};

export default function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello, React.js!");
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <br />
      <input className="border" onChange={(e) => setText(e.target.value)} />
      <Child text={text} />
    </div>
  );
}

```

当我们点击按钮更新 count 值时，会触发页面组件和子组件的重渲染，实际上，子组件并没有依赖 count 值，在这种情况下，如果我不希望在子组件未依赖的状态发生变化时，不触发子组件的重渲染该如何处理呢？此时，我们可以将子组件包括在 **memo** 中，如下所示：

```tsx
const Child = React.memo(function ({ text }: { text: string }) {
  console.log("Child render");
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
});
```

然后观察控制台输出，你会发现，点击按钮修改 count 将不会出发子组件的重渲染。

现在，假设我需要在父组件中传递一个变量 `version` 到子组件中，如下所示：

```tsx
import { useState } from "react";

const Child = function ({ version, text }: { version: string; text: string }) {
  console.log("Child render");
  return (
    <div>
      <h1>{text}</h1>
      {/* +++++++++++++++++++++++++++++++++++++++++ */}
      <p>Version: {version}</p>
      {/* +++++++++++++++++++++++++++++++++++++++++ */}
    </div>
  );
};

export default function App() {
  // +++++++++++++++++++++++++++++++++++++++++++
  const version = (function () {
    const startTime = performance.now();
    while (performance.now() - startTime < 500) {
      // -- 在 500 毫秒内什么都不做以模拟极其缓慢的代码
    }
    return "1.0.0";
  })();
  // +++++++++++++++++++++++++++++++++++++++++++

  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello, React.js!");
  return (
    <div>
      <p>You clicked {count} times.</p>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <br />
      <input className="border" onChange={(e) => setText(e.target.value)} />
      <Child text={text} version={version} />
    </div>
  );
}
```

你会发现，当我点击按钮更新 count 时，触发父组件的重新渲染，由于子组件依赖父组件传入的 version，而 version 在每次父组件重渲染时都会被重新定义，因此导致了子组件的重渲染，当然这个很容理解，但是仔细观察，你会发现，每次点击更新 count 值时，渲染的速度变慢了，这是为什么呢？因为每一次都会去计算 version 的值，这里我们模拟了 500ms 的耗时动作，但实际上，这不是必要的，因为 version 的结果是没变的，此时我们可以使用 useMemo 来包裹，对其值做一个缓存，如下所示：

```tsx
const version = useMemo(() => {
  const startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // -- 在 500 毫秒内什么都不做以模拟极其缓慢的代码
  }
  return "1.0.0";
}, []);
```

此时，你会发现，除了首次渲染耗时之外，后面点击按钮更新 count 时，组件的渲染速度都很快，因为没走那 500ms 的耗时动作。

> 温馨提示：关于 useMemo 的更多用法，请参考 [这里 >>](https://zh-hans.react.dev/reference/react/useMemo#usage)。

### useCallback

@See https://zh-hans.react.dev/reference/react/useCallback

useCallback 在每次重新渲染的时候能够缓 **函数**。

**语法形式：**

```tsx
const cachedFn = useCallback(fn, dependencies)
```

语法解读：

- `fn`：fn 是要缓存的函数，可以接收任意参数并返回任意值。React 在初次渲染时会将该函数返回，而非调用。若依赖项未变化，后续渲染会返回同一函数；否则返回新传入的函数并缓存。React 不调用函数，调用与否由你决定。
- `dependencies`： fn 依赖的响应式值列表（如 props、state 及组件内声明的变量和函数）。React 使用 Object.is 比较依赖项的新旧值，决定是否更新 fn。依赖列表需明确并写成 [dep1, dep2] 形式。

**返回值：**

- 在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

- 在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

**🔵 基础示例 —— 跳过组件的重新渲染**

在介绍 useMemo 时我们提到，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件，为了避免不必要的渲染，构造子组件时我们可以通过 `memo` 来包裹，届时，只有在子组件依赖属性发生变化之后才会触发子组件的重新渲染，接下来我们看一组示例：

```tsx
import { ChangeEvent, ChangeEventHandler, memo, useState } from "react";

const Child = memo(function ({ onChange }: { onChange: ChangeEventHandler<HTMLInputElement> }) {
  console.log("Child render");
  return <input onChange={onChange} className="border" autoFocus />;
});

export default function App() {
  const [text, setText] = useState("Hello, React.js!");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  return (
    <div>
      <p>Text: {text} </p>
      <Child onChange={handleChange} />
    </div>
  );
}
```

在子组件中，引用了父组件的 `onChange`  方法，正常来说该方法是不变的，但是当触发 input-change 事件更新 `text` 值之后会触发父组件的重渲染，这样就导致 `onChange` 被重新创建，对于子组件而言，引用的就是一个新的 `onChange` 函数， 进而导致了子组件的重渲染。此时的优化就需有 `memo` 和 `useCallback` 配合使用啦。

```react
const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setText(e.target.value);
}, []);
```

> 温馨提示：关于 useCallback 的更多用法，请参考 [这里 >>](https://zh-hans.react.dev/reference/react/useCallback#usage)

## 表单 Hook

### useActionState

@See https://zh-hans.react.dev/reference/react/useActionState

useActionState 是一个可以根据某个表单动作的结果更新 state 的 Hook。

**语法形式：**

```tsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

**语法解读：**

- `fn`：当按钮被按下或者表单被提交时触发的函数。这个函数可能包含一些副作用操作，比如发送网络请求或者执行一些长时间运行的计算任务。它在`useActionState`内部被调用，用于触发状态的更新。当函数被调用时，该函数会接收到表单的上一个 state（初始值为传入的 `initialState` 参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数。

- `initialState`：state 的初始值。任何可序列化的值都可接收。当 action 被调用一次后该参数会被忽略。

- `permalink?`：这个参数是可选的。它的具体用途可能因具体的应用场景和代码库的设计而有所不同。通常，它可能用于生成一个持久化的链接或者标识符，用于在应用的不同部分引用或者共享这个状态相关的操作。例如，在一个路由系统中，它可能用于生成一个特定于这个状态操作的 URL 路径片段。

**返回值：**

- `state`：当前的 state。第一次渲染期间，该值为传入的 `initialState` 参数值。在 action 被调用后该值会变为 action 的返回值。

- `formAction`：这是一个用于触发`fn`函数执行的函数。当组件需要执行`fn`函数所代表的操作时，可以调用这个`formAction`函数。

  比如，在一个表单提交的场景中，`formAction`可能是一个提交表单数据的函数，点击提交按钮时调用这个函数来发送表单数据并更新状态。

- `isPending`：这是一个布尔值，用于表示`fn`函数是否正在执行。当`fn`函数被调用后，在它执行完成之前，`isPending`会被设置为`true`；当`fn`函数执行完成后，`isPending`会被设置为`false`。

  这在处理加载状态（如显示加载动画）时非常有用。例如，当发送一个网络请求获取数据时，在请求进行过程中，可以根据`isPending`的值来显示一个加载指示器，当`isPending`为`false`时，表示数据已经获取完成或者操作已经结束，就可以隐藏加载指示器并显示数据。

**注意：**

1. 在支持 React 服务器组件的框架中使用该功能时，`useActionState` 允许表单在服务器渲染阶段时获得部分交互性。当不使用服务器组件时，它的特性与本地 state 相同。
2. 直接通过表单动作调用的函数不同，传入 `useActionState` 的函数被调用时，会多传入一个代表 state 的上一个值或初始值的参数作为该函数的第一个参数。

**🔵 基础示例 —— 使用某个表单动作返回的信息**

![](./imgs/useActionState.gif)

> **`@/src/app/page.tsx`**

```tsx
import { createUser } from "@/actions";
import { useActionState } from "react";

export default function Page() {
  const [state, formAction, isPending] = useActionState(createUser, {});
  return (
    <div className="container mx-auto mt-4">
      <form action={formAction} autoComplete="off" className="space-y-4">
        <p>
          <label htmlFor="username" className="block">
            用户名：
          </label>
          <input type="text" id="username" name="username" className="border" defaultValue={state.username} required />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.usernameTips}
          </p>
        </p>
        <p>
          <label htmlFor="phone" className="block">
            手机号：
          </label>
          <input type="tel" id="phone" name="phone" className="border" defaultValue={state.phone} required maxLength={11} />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.phoneTips}
          </p>
        </p>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md">{isPending ? "加载中..." : "提交"}</button>
      </form>
    </div>
  );
}
```

> **`@/src/actions/index.ts`**

```tsx
export type State = {
  /** 错误消息 */
  errorTips?: string;
  /** 用户名，用于提交之后回显（因为提交之后会重置表单） */
  username?: string;
  /** 用户名，错误消息 */
  usernameTips?: string;
  /** 手机号，用于提交之后回显（因为提交之后会重置表单） */
  phone?: string;
  /** 手机号，错误消息 */
  phoneTips?: string;
}

/**
 * 创建用户
 * @param previousState 
 * @param formData 
 * @returns 
 */
export async function createUser(previousState: State, formData: FormData) {

  console.log(`previousState: ${JSON.stringify(previousState)}`);

  // -- 获取表单数据
  const username = formData.get('username') as string;
  const phone = formData.get('phone') as string;

  // -- 表单校验
  if (!/^\w+$/.test(username)) {
    return { usernameTips: '用户名必须为字母、数字、下划线', username, phone } as State
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { phoneTips: '手机号格式错误', username, phone } as State
  }

  // -- 模拟请求耗时
  await new Promise(resolve => setTimeout(resolve, 1000));
  const resp = {
    code: 200,
    data: null,
    message: 'success',
  }
  if (resp.code === 200) {
    console.log('注册成功')
  }

  return { errorTips: '请求失败', username, phone } as State

}
```

## 其他 Hook

这些 Hook 主要适用于库作者，不常在应用程序代码中使用。

- 使用 [`useDebugValue`](https://zh-hans.react.dev/reference/react/useDebugValue) 自定义 React 开发者工具为自定义 Hook 添加的标签。
- 使用 [`useId`](https://zh-hans.react.dev/reference/react/useId) 将唯一的 ID 与组件相关联，其通常与可访问性 API 一起使用。
- 使用 [`useSyncExternalStore`](https://zh-hans.react.dev/reference/react/useSyncExternalStore) 订阅外部 store。

- 使用 [`useActionState`](https://zh-hans.react.dev/reference/react/useActionState) 允许你管理动作的状态。

# 自定义Hook

@See https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks

React 有一些内置 Hook，例如 `useState`，`useContext` 和 `useEffect`。有时你需要一个用途更特殊的 Hook：例如获取数据，记录用户是否在线或者连接聊天室。虽然 React 中可能没有这些 Hook，但是你可以根据应用需求创建自己的 Hook。

## 共享逻辑

@See https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks#custom-hooks-sharing-logic-between-components

假设现在有两个组件：

1. `StatusBar`：展示网络状态
2. `SaveButton`：在有网状态下展示 `Save progress`，断网状态下展示 `Reconnecting...`

显然，这两个组件都拥有共同逻辑，即监听网络状态（订阅全局 online 和 offline） 事件，接下来我们一起实现

1）提取自定义 Hook，取名 `useOnlineStatus`

```ts
import React from "react";
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };

  }, []);

  return isOnline
}
```

2）在组建中使用 `useOnlineStatus`

```tsx
"use client";

import { useOnlineStatus } from "@/hooks";
import React from "react";

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? "✅ Online" : "❌ Disconnected"}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  const handleSaveClick = () => {
    console.log("✅ Progress saved");
  };

  return (
    <button disabled={!isOnline} onClick={handleSaveClick} className="bg-blue-500 text-white px-2">
      {isOnline ? "Save progress" : "Reconnecting..."}
    </button>
  );
}

export default function Page() {
  return (
    <div>
      <StatusBar />
      <SaveButton />
    </div>
  );
}
```

切换网络状态验证一下是否会同时更新两个组件。

> 注意：
>
> - **React 组件名称必须以大写字母开头**
> - **Hook 的名称必须以 `use` 开头，然后紧跟一个大写字母**

## 何时使用自定义 Hook？

1. 复用逻辑：如果组件之间共享相同的逻辑，建议抽离成自定义 Hook。
2. 复杂的副作用逻辑：如果 useEffect 或其他副作用逻辑变得复杂或在多个组件中重复，可以提取为自定义 Hook。
3. 逻辑拆分，提升可读性：如果一个组件的逻辑过于复杂，可以将其拆分成多个小型自定义 Hook，使代码更清晰。
4. 与第三方库交互：当需要处理第三方库的复杂逻辑（如 API 请求、事件监听等）时，可以封装为自定义 Hook。
5. 对状态或者逻辑进行封装：将状态管理和操作封装到自定义 Hook 中，提供简单易用的接口。

> 总结：使用自定义 Hook 的目的是为了让逻辑 **复用、清晰和模块化**，增强代码的可读性和可维护性。如果某个逻辑在多个地方使用，或者逻辑过于复杂、难以管理，都可以尝试将其封装为自定义 Hook。

# React Hooks 数据流

1. **单组件数据流：**

   - useState：用于管理组件内部的简单状态，适合轻量级的状态逻辑。

   - useReducer：适合处理复杂状态，集中管理多种状态更新逻辑。

2. **嵌套组件数据流：**

   使用 Props 实现单向数据流，将父组件的数据通过属性传递给子组件。方法简单直接，但在组件嵌套层次过深时，容易导致“props drilling”问题。

3. **跨组件数据流：**

   - Context：轻量级的共享数据工具，适用于少量全局状态共享。但对于复杂状态管理，可能会引发嵌套回调和性能问题。

   - Context + useReducer：适用于中小型应用的全局状态管理，结合 reducer 模式集中处理状态更新逻辑。

   - Redux Toolkit：强大的全局状态管理工具，适用于复杂和大型应用，提供完善的生态和调试工具。

   - 其他轻量状态管理工具（如 Zustand、Jotai）：性能优越且使用简便，适合中小型项目，能够减少 Context 的性能开销。

**选择建议**

1. 状态简单：使用 useState 或 Props。
2. 状态复杂但作用域局限：使用 useReducer 或 Context + useReducer。
3. 状态复杂且跨组件范围大：使用 Redux Toolkit 或轻量状态管理工具（如 Zustand）。

# React 如何管理Hooks？

> @See https://zh-hans.react.dev/reference/rules/rules-of-hooks

**Hook** 只能在 **组件的顶层** 或自定义的 Hook 中调用，**不要在循环、条件语句、嵌套函数或 `try`/`catch`/`finally` 代码块中调用 Hook**。

核心原因在于React 内部通过 **单向链表** 来跟踪和管理 Hooks。

每个 Hook 节点包含：

- `memoizedState`：当前状态值（如 `useState` 的 state）
- `queue`：更新队列（存储 `setState` 触发的 action）
- `next`：指向下一个 Hook 的指针

每次组件渲染时，React 都会按照 Hooks 的调用顺序来更新链表中的值，例如：

```tsx
function MyComponent() {
  const [name, setName] = useState('Alice'); // Hook 1
  const [age, setAge] = useState(25);        // Hook 2
  useEffect(() => {                          // Hook 3
    console.log('Component mounted');
  }, []);
  // ...
}
```

在第一次渲染时，React 会记录 Hooks 的调用顺序：

1. `useState` → `name`
2. `useState` → `age`
3. `useEffect` → 副作用函数

在后续渲染中，React 会严格按照这个顺序来匹配 Hooks 的状态和副作用。

## 为什么不能在循环、条件或嵌套函数中调用 Hooks？

如果在循环、条件或嵌套函数中调用 Hooks，会导致 Hooks 的调用顺序不一致，从而破坏 React 对 Hooks 的管理。

### 示例 1：条件语句中调用 Hooks

```tsx
function MyComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [name, setName] = useState('Alice'); // Hook 1
  }
  const [age, setAge] = useState(25);          // Hook 2
  // ...
}
```

- 如果 `isLoggedIn` 为 `true`，Hooks 的调用顺序是：

  1. `useState` → `name`

  2. `useState` → `age`

- 如果 `isLoggedIn` 为 `false`，Hooks 的调用顺序是：
  1. `useState` → `age`

此时，React 无法正确匹配 `age` 的状态，因为调用顺序发生了变化，可能导致 bug。

### 示例 2：循环中调用 Hooks

```tsx
function MyComponent({ items }) {
  for (let i = 0; i < items.length; i++) {
    const [value, setValue] = useState(items[i]); // Hook 1, 2, 3, ...
  }
  // ...
}

```

- 每次渲染时，`items.length` 可能不同，导致 Hooks 的调用顺序不一致。
- React 无法确定每个 `useState` 对应的状态，从而导致混乱。

### 示例 3：嵌套函数中调用 Hooks

```tsx
function MyComponent() {
  function handleClick() {
    const [count, setCount] = useState(0); // 错误：嵌套函数中调用 Hook
  }
  // ...
}
```

- 嵌套函数中的 Hooks 不会在组件渲染时被调用，因此 React 无法正确管理它们。

## 如何避免这些问题？

为了确保 Hooks 的调用顺序一致，必须遵循以下规则：

1. **始终在函数组件的顶层调用 Hooks**：

   - 不要在循环、条件或嵌套函数中调用 Hooks。
   - 确保每次渲染时 Hooks 的调用顺序完全相同。

2. **将条件逻辑移到 Hooks 内部**：

   - 如果需要在某些条件下使用 Hooks，可以将条件逻辑移到 Hooks 内部。

   - 正确示例：

     ```tsx
     function MyComponent({ isLoggedIn }) {
       const [name, setName] = useState(isLoggedIn ? 'Alice' : ''); // 条件逻辑在 Hook 内部
       const [age, setAge] = useState(25);
       // ...
     }
     ```

3. **使用 `useEffect` 处理副作用**：

   - 如果需要在某些条件下执行副作用，可以在 `useEffect` 内部添加条件判断。

   - 正确示例：

     ```tsx
     function MyComponent({ isLoggedIn }) {
       useEffect(() => {
         if (isLoggedIn) {
           console.log('User is logged in');
         }
       }, [isLoggedIn]); // 依赖项变化时执行
       // ...
     }
     ```

## React 如何检测违规行为？

React 提供了一个 ESLint 插件（`eslint-plugin-react-hooks`），用于检测 Hooks 的违规使用。如果违反了 Hooks 的规则，React 会在开发模式下抛出错误。

例如：

```
React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render.
```

## 总结

1. React 依赖于 Hooks 的调用顺序来管理状态和副作用。
2. 在循环、条件或嵌套函数中调用 Hooks 会导致调用顺序不一致，从而引发 bug。
3. 始终在函数组件的顶层调用 Hooks，并将条件逻辑移到 Hooks 内部。
4. 使用 ESLint 插件可以帮助检测和避免违规行为。

https://ahooks.js.org/zh-CN/
