# 一、概述

> @See https://zh-hans.react.dev/reference/react/hooks

Hook 是 React 16.8 的新增特性，**Hook** 可以帮助在组件中使用不同的 React 功能。你可以使用内置的 Hook 或使用自定义 Hook。

> 提示：Hook 只能在 **组件的顶层** 或自己的 Hook 中调用它。你不能在循环或条件语句中调用它。如果你需要这样做，请提取一个新组件并将状态移入其中。

# 二、API

## State Hook

### useState

> @See https://zh-hans.react.dev/reference/react/useState

useState 允许你向组件添加一个 **状态变量**。

语法形式：

```jsx
const [state, setState] = useState(initialState)
```

语法解读：

- `state`：当前的 state。在首次渲染时，它将与你传递的 `initialState` 相匹配。
- `setState`：更新状态的函数，接收新值，替换旧值，加入渲染队列，统一重新渲染。
- `initialState`：初始值，只会在初始渲染时使用，可以是基本数据类型也可以是对象。

基础示例：

```jsx
"use client";
import React, { useState } from "react";

export default function Page() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You Click the Button {count /** 读取 State */} times.</p>
      <button onClick={() => setCount(count + 1)} /** 更新 State */>Tap Here.</button>
    </div>
  );
}
```

- `nextState`：你想要 state 更新为的值。它可以是任何类型的值，但对于函数有特殊的行为

  如果你将函数作为 `nextState` 传递，它将被视为 **更新函数**。它必须是纯函数，只接受待定的 state 作为其唯一参数，并应返回下一个状态。React 将把你的更新函数放入队列中并重新渲染组件。在下一次渲染期间，React 将通过把队列中所有更新函数应用于先前的状态来计算下一个状态。

注意事项：

- `set` 函数 **仅更新【下一次】渲染的状态变量**。如果在调用 `set` 函数后读取状态变量，则 [仍会得到在调用之前显示在屏幕上的旧值](https://zh-hans.react.dev/reference/react/useState#ive-updated-the-state-but-logging-gives-me-the-old-value)。
- 如果你提供的新值与当前 `state` 相同（由 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较确定），React 将 **跳过重新渲染该组件及其子组件**。这是一种优化。虽然在某些情况下 React 仍然需要在跳过子组件之前调用你的组件，但这不应影响你的代码。
- React 会 [批量处理状态更新](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。它会在所有 **事件处理函数运行** 并调用其 `set` 函数后更新屏幕。这可以防止在单个事件期间多次重新渲染。在某些罕见情况下，你需要强制 React 更早地更新屏幕，例如访问 DOM，你可以使用 [`flushSync`](https://zh-hans.react.dev/reference/react-dom/flushSync)。
- `set` 函数具有稳定的标识，所以你经常会看到 Effect 的依赖数组中会省略它，即使包含它也不会导致 Effect 重新触发。如果 linter 允许你省略依赖项并且没有报错，那么你就可以安全地省略它。[了解移除 Effect 依赖项的更多信息。](https://zh-hans.react.dev/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
- 在渲染期间，只允许在当前渲染组件内部调用 `set` 函数。React 将丢弃其输出并立即尝试使用新状态重新渲染。这种方式很少需要，但你可以使用它来存储 **先前渲染中的信息**。
- 在严格模式中，React 将 **两次调用你的更新函数**，以帮助你找到 [意外的不纯性](https://zh-hans.react.dev/reference/react/useState#my-initializer-or-updater-function-runs-twice)。这只是开发时的行为，不影响生产。如果你的更新函数是纯函数（本该是这样），就不应影响该行为。其中一次调用的结果将被忽略。

> 温馨提示：关于 `useState` 的更多用法，请参考 [官方指南 >>](https://zh-hans.react.dev/reference/react/useState)

### useReducer

@See https://zh-hans.react.dev/reference/react/useReducer

useReducer 允许你向组件里面添加一个 [reducer](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer)。

语法形式：

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

参数：

- `reducer`：用于更新 state 的纯函数。参数为 state 和 action，返回值是更新后的 state。state 与 action 可以是任意合法值。
- `initialArg`：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 `init` 参数。
- `init?`：用于计算初始值的函数。如果存在，使用 `init(initialArg)` 的执行结果作为初始值，否则使用 `initialArg`。

返回值：

- `state`：当前的 state
- `dispatch`：用于更新 state 并触发组件的重新渲染。

**🔵 基础示例**

```react
"use client";
import React, { ChangeEvent, useReducer } from "react";

// 1. 定义类型
type State = { name: string; age: number };
type Action = 
  { type: "CHANGE_NAME"; payload: string } | 
  { type: "INCREMENT_AGE" } | 
  { type: "DECREMENT_AGE" };

// 2. 构造初始值
const initialState: State = { name: "张三", age: 18 };

// 3. 定义 reducer 处理状态更新
const reducer: React.Reducer<State, Action> = (state, action) => {
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
export default function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_NAME", payload: e.target.value });
  };

  return (
    <div>
      <p><strong>name：</strong>{state.name}</p>
      <p><strong>age：</strong>{state.age}</p>
      <div className="space-x-2 mt-2">
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

1）**定义 Payloads 对象**

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

2） **定义 Actions 类型**

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
$ pnpm add immer
```

代码示例：

```tsx
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
          <input 
            className="border" 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
          />
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
              <span 
                className={item.done ? "text-gray-400 line-through" : "text-gray-600"}
              >{item.text}</span>
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

useContext 可以让你读取和订阅组件中的 [context](https://zh-hans.react.dev/learn/passing-data-deeply-with-context)。`Context`提供了一种在组件树中共享数据的方式，而不必通过层层传递`props`。

> 例如，想象你有一个应用程序，其中有一个主题（如亮色主题或暗色主题），这个主题信息需要被多个不同层次的组件使用。如果通过`props`传递，会导致代码变得复杂且难以维护。`Context`和`useContext`就可以很好地解决这个问题。

语法形式：

```tsx
const value = useContext(SomeContext);
```

参数：

- `SomeContext`：context 对象，通过 ``React.createContext`` 创建

返回值：

- `value`：该 context 的当前值，当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` 属性决定。

注意事项：

- `useContext` 参数必须是 `context` 对象本身。
- 组件中的 `useContext()` 调用不受 **同一** 组件返回的 provider 的影响。相应的 `<Context.Provider>` 需要位于调用 `useContext()` 的组件 **之上**。
- 从 provider 接收到不同的 `value` 开始，React 自动重新渲染使用了该特定 context 的所有子级。先前的值和新的值会使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 来做比较。使用 [`memo`](https://zh-hans.react.dev/reference/react/memo) 来跳过重新渲染并不妨碍子级接收到新的 context 值。
- 如果你的构建系统在输出中产生重复的模块（可能发生在符号链接中），这可能会破坏 context。通过 context 传递数据只有在用于传递 context 的 `SomeContext` 和用于读取数据的 `SomeContext` 是完全相同的对象时才有效，这是由 `===` 比较决定的。

**🔵 综合示例 —— 结合useReducer** 

useReducer，可以帮助我们集中式的处理复杂的 state 管理。但如果我们的页面很复杂，拆分成了多层多个组件，我们如何在子组件触发这些 state 变化呢？

我们可以结合 useContext 使用，将 dispatch 作为 <b><ins>value</ins></b> 属性传递给子组件即可。我们来看一组示例：

```tsx
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
  // -- 通过 useContext 获取上下文的 state、dispatch
  const { state, dispatch } = React.useContext(Context);
  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.age}</p>
      <div className="space-x-4">
        <button 
          onClick={() => dispatch({ type: "change_name", payload: "Jerry" })}
        >
          Change Name
        </button>
        <button 
          onClick={() => dispatch({ type: "change_age", payload: 20 })}
        >
          Change Age
        </button>
      </div>
    </div>
  );
}
```

> 温馨提示：关于 `useContext` 的更多用法，请参考 [官方指南 >>](https://zh-hans.react.dev/reference/react/useContext)

## Ref Hook

ref 是 React 中的“脱围机制”，用于[保存不影响渲染的信息](https://zh-hans.react.dev/learn/referencing-values-with-refs)，如 DOM 节点或计时器 ID。与状态不同，更新 ref 不会触发重新渲染，常用于与浏览器 API 等非 React 系统交互。

- 使用 [`useRef`](https://zh-hans.react.dev/reference/react/useRef) 声明 ref。你可以在其中保存任何值，但最常用于保存 DOM 节点。
- 使用 [`useImperativeHandle`](https://zh-hans.react.dev/reference/react/useImperativeHandle) 自定义从组件中暴露的 ref，但是很少使用。

### useRef

@See https://zh-hans.react.dev/reference/react/useRef

useRef 引用一个不需要渲染的值。

语法形式：

```tsx
const ref = useRef(initialValue)
```

语法解读：

- `initialValue`：ref 对象的 `current` 属性的初始值。可以是任意类型的值。这个参数在首次渲染后被忽略。
- `ref`：只有一个属性的对象
  - `current`：初始值为传递的 `initialValue`。之后可以将其设置为其他值。如果将 ref 对象作为一个 JSX 节点的 `ref` 属性传递给 React，React 将为它设置 `current` 属性。

在后续的渲染中，`useRef` 将返回同一个对象。

注意事项：

- ref.current 是可变的，但不应修改它来存储与渲染相关的对象，也就是说，不应出现在 jsx 中。
- 修改 ref.current 不会触发组件重新渲染，因为 React 不会监控其变化。
- 除初始化外，请避免在渲染期间读写 ref.current，否则可能导致组件行为不可预测。

使用 ref 可以确保：

- 可以在重新渲染之间 **存储信息**（普通对象存储的值每次渲染都会重置）。
- 改变它 **不会触发重新渲染**（状态变量会触发重新渲染）。
- 对于组件的每个副本而言，**这些信息都是本地的**（外部变量则是共享的）。

> 温馨提示：关于 `useRef` 的使用，请参考 [官方指南 >>](https://zh-hans.react.dev/reference/react/useRef#usage)

### useImperativeHandle

@See https://zh-hans.react.dev/reference/react/useImperativeHandle

useImperativeHandle 用于自定义暴露给父组件的 ref 对象，以便父组件通过 ref 调用子组件的特定方法或属性。

语法形式：

```tsx
useImperativeHandle(ref, createHandle, dependencies?)
```

语法解读：

- `ref`：父组件传入的 ref 对象，通过它暴露子组件的实例或方法。
- `createHandle`：一个函数，用于返回自定义的 ref 对象内容。可以是对象、方法等。
- `dependencies?`：依赖数组，类似于 useEffect 的依赖，当依赖变化时会重新生成 createHandle 返回的内容。

> 温馨提示：从 **React 19** 开始，可以 [直接将 ref 作为子组件的一个普通 prop 传递](https://zh-hans.react.dev/blog/2024/12/05/react-19#ref-as-a-prop)，无需再依赖 forwardRef 来显式传递 ref。而在 **React 18 及更早版本**中，ref 是一个特殊的属性，默认情况下无法直接作为 prop 传递给子组件。如果需要在子组件中访问 ref，必须使用 forwardRef 包裹子组件。

**🔵 综合示例**

```tsx
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
```

> ❗️注意：
>
> - **不要滥用 ref。** 你应当仅在你没法通过 prop 来表达 *命令式* 行为的时候才使用 ref：例如，滚动到指定节点、聚焦某个节点、触发一次动画，以及选择文本等等。
> - **如果可以通过 prop 实现，那就不应该使用 ref**。例如，你不应该从一个 `Modal` 组件暴露出 `{open, close}` 这样的命令式句柄，最好是像 `<Modal isOpen={isOpen} />` 这样，将 `isOpen` 作为一个 prop。[副作用](https://zh-hans.react.dev/learn/synchronizing-with-effects) 可以帮你通过 prop 来暴露一些命令式的行为。

## Effect Hook

Effect Hook 能让组件连接并同步外部系统，像网络、浏览器、DOM 等非 React 代码的交互都可以在这里处理。但要注意，它算是 React 范式里的 “脱围机制”，尽量别用它来协调应用数据流，如果没和外部系统交互的需求，可能就用不着它。

useEffect 还有两种不太常用的变体，他们在执行时机有所不同：

- `useLayoutEffect`，会在浏览器重绘屏幕前运行，适合在此测量布局。
- `useInsertionEffect`，在 React 修改 DOM 前触发，库可以借此插入动态 CSS。

### useEffect

@See https://zh-hans.react.dev/reference/react/useEffect

useEffect 可以让你在函数组件中执行副作用（数据获取，订阅或者手动修改DOM）操作，它允许你 [将组件与外部系统同步](https://zh-hans.react.dev/learn/synchronizing-with-effects)。

语法形式：

```tsx
useEffect(setup, dependencies?)
```

语法解读：

- `setup`：执行副作用的函数。可选择返回一个 **清理函数**（cleanup）。React 在组件挂载时运行 setup。如果依赖项变更，React 会先运行旧的清理函数（如果存在），然后运行新的 setup。在组件卸载时，React 会最后一次运行清理函数。
- `dependencies?`：一个数组，列出 setup 中使用的所有响应式值（如 props、state 以及组件内部声明的变量和函数）。React 使用 Object.is 比较依赖项的新旧值，决定是否重新运行 setup。依赖项数组必须固定，并以 [dep1, dep2] 的形式内联编写。如果省略，setup 在每次组件重新渲染时都会重新执行。

**🔵 基础示例 —— 链接到外部系统 **

有些组件需要与网络、某些浏览器 API 或第三方库保持连接，当它们显示在页面上时。这些系统不受 React 控制，所以称为外部系统。

> 监听全局的浏览器事件 

```tsx
"use client";
import React from "react";

function Page1() {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
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
"use client";
import React from "react";

export default function page() {
  const [userId, setUserId] = React.useState(1);
  const [data, setData] = React.useState<Record<string, any> | null>(null);
  React.useEffect(() => {
    
    const getData = async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const json = await response.json();
      if (!ignore) setData(json);
    };
    
    let ignore = false;
    getData();
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

useLayoutEffect 是 useEffect 的一个版本，**在浏览器重新绘制屏幕之前触发**。这个 Hook 可能会影响性能，尽可能去使用 useEffect。

> 提示：大多数的场景中都应该使用 useEffect 来实现我们的逻辑，仅仅在一些特殊情况，比如需要去监听同步更新状态防止页面闪动时才需要 useLayoutEffect。

## Performance Hook

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

语法形式：

```tsx
const cachedValue = useMemo(calculateValue, dependencies)
```

语法解读：

- `calculateValue`：是一个无参纯函数，用于计算缓存值。首次渲染时会调用，之后仅在 dependencies 变化时重新执行，并返回最新结果，缓存供下次使用。
- `dependencies`：是 calculateValue 中使用的响应式变量（如 props、state）组成的数组，需写为固定形式 [dep1, dep2]。React 使用 Object.is 比较每个依赖项的新旧值，决定是否重新计算。

返回值：

- 在初次渲染时，`useMemo` 返回不带参数调用 `calculateValue` 的结果。

- 在接下来的渲染中，如果依赖项没有发生改变，它将返回上次缓存的值；否则将再次调用 `calculateValue`，并返回最新结果。

**🔵 基础示例**

```tsx
"use client";
import React from "react";

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

export default function Page() {
  const filteredTodos = React.useMemo(() => todos.filter((todo) => todo.done), [todos]);
  return <div> ... </div>;
}
```

**🔵 跳过组件的重新渲染**

**默认情况下，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件**，我们来看一组示例：

```tsx
"use client";
import React from "react";

const Child = function ({ text }: { text: string }) {
  console.log("Child render");
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
};

export default function Page() {
  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState("Hello, React.js!");
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
"use client";
import React from "react";

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

export default function Page() {
  // +++++++++++++++++++++++++++++++++++++++++++
  const version = (function () {
    const startTime = performance.now();
    while (performance.now() - startTime < 500) {
      // -- 在 500 毫秒内什么都不做以模拟极其缓慢的代码
    }
    return "1.0.0";
  })();
  // +++++++++++++++++++++++++++++++++++++++++++

  const [count, setCount] = React.useState(0);
  const [text, setText] = React.useState("Hello, React.js!");
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

语法形式：

```tsx
const cachedFn = useCallback(fn, dependencies)
```

语法解读：

- `fn`：fn 是要缓存的函数，可以接收任意参数并返回任意值。React 在初次渲染时会将该函数返回，而非调用。若依赖项未变化，后续渲染会返回同一函数；否则返回新传入的函数并缓存。React 不调用函数，调用与否由你决定。
- `dependencies`： fn 依赖的响应式值列表（如 props、state 及组件内声明的变量和函数）。React 使用 Object.is 比较依赖项的新旧值，决定是否更新 fn。依赖列表需明确并写成 [dep1, dep2] 形式。

返回值：

- 在初次渲染时，`useCallback` 返回你已经传入的 `fn` 函数

- 在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

**🔵 基础示例 —— 跳过组件的重新渲染**

在介绍 useMemo 时我们提到，当一个组件重新渲染时，React 会递归地重新渲染它的所有子组件，为了避免不必要的渲染，构造子组件时我们可以通过 `memo` 来包裹，届时，只有在子组件依赖属性发生变化之后才会触发子组件的重新渲染，接下来我们看一组示例：

```tsx
"use client";
import React from "react";

const Child = React.memo(function ({ onChange }: { onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  console.log("Child render");
  return <input onChange={onChange} className="border" autoFocus />;
});

export default function Page() {
  const [text, setText] = React.useState("Hello, React.js!");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

## Action Hook

### useActionState

@See https://zh-hans.react.dev/reference/react/useActionState

useActionState 是一个可以根据某个表单动作的结果更新 state 的 Hook。

语法形式：

```tsx
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

语法解读：

- `fn`：当按钮被按下或者表单被提交时触发的函数。这个函数可能包含一些副作用操作，比如发送网络请求或者执行一些长时间运行的计算任务。它在`useActionState`内部被调用，用于触发状态的更新。当函数被调用时，该函数会接收到表单的上一个 state（初始值为传入的 `initialState` 参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数。

- `initialState`：state 的初始值。任何可序列化的值都可接收。当 action 被调用一次后该参数会被忽略。

- `permalink?`：这个参数是可选的。它的具体用途可能因具体的应用场景和代码库的设计而有所不同。通常，它可能用于生成一个持久化的链接或者标识符，用于在应用的不同部分引用或者共享这个状态相关的操作。例如，在一个路由系统中，它可能用于生成一个特定于这个状态操作的 URL 路径片段。

返回值：

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

`@/src/app/page.tsx`

```tsx
"use client";
import { createUser } from "@/actions";
import React from "react";

export default function Page() {
  const [state, formAction, isPending] = React.useActionState(createUser, {});
  return (
    <div className="container mx-auto mt-4">
      <form action={formAction} autoComplete="off" className="space-y-4">
        <p>
          <label htmlFor="username" className="block">用户名：</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            className="border" 
            defaultValue={state.username} required 
          />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.usernameTips}
          </p>
        </p>
        <p>
          <label htmlFor="phone" className="block">手机号：</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            className="border" 
            defaultValue={state.phone} required maxLength={11}
          />
          <p className="text-red-500 mt-1" aria-live="polite">
            {state?.phoneTips}
          </p>
        </p>
        <button className="bg-blue-500 text-white px-4 py-1 rounded-md">
          {isPending ? "加载中..." : "提交"}
        </button>
      </form>
    </div>
  );
}
```

`@/src/actions/index.ts`

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

## Other Hook

这些 Hook 主要适用于库作者，不常在应用程序代码中使用。

- 使用 [`useDebugValue`](https://zh-hans.react.dev/reference/react/useDebugValue) 自定义 React 开发者工具为自定义 Hook 添加的标签。
- 使用 [`useId`](https://zh-hans.react.dev/reference/react/useId) 将唯一的 ID 与组件相关联，其通常与可访问性 API 一起使用。
- 使用 [`useSyncExternalStore`](https://zh-hans.react.dev/reference/react/useSyncExternalStore) 订阅外部 store。

- 使用 [`useActionState`](https://zh-hans.react.dev/reference/react/useActionState) 允许你管理动作的状态。

# 三、自定义Hook

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

## 小记

- 自定义 Hook 让你可以在组件间共享逻辑。
- 自定义 Hook 命名必须以 `use` 开头，后面跟一个大写字母。
- 自定义 Hook 共享的只是状态逻辑，不是状态本身。
- 你可以将响应值从一个 Hook 传到另一个，并且他们会保持最新。
- 每次组件重新渲染时，所有的 Hook 会重新运行。
- 自定义 Hook 的代码应该和组件代码一样保持纯粹。
- 把自定义 Hook 收到的事件处理函数包裹到 Effect Event。
- 不要创建像 `useMount` 这样的自定义 Hook。保持目标具体化。
- 如何以及在哪里选择代码边界取决于你。

# 四、React Hooks 数据流

1. 单组件数据流：

   - useState：用于管理组件内简单状态，适合轻量的状态逻辑。

   - useReducer：适合复杂状态管理，集中处理多种状态更新逻辑。

2. 嵌套组件数据流：Props，单向数据流，将父组件数据通过属性传递给子组件，简单直接，但组件嵌套层次过深时容易导致 “props drilling” 问题。

3. 跨组件数据流：

   - Context：轻量级共享数据工具，适用于少量全局状态共享，但较复杂状态管理可能导致嵌套回调和性能问题。

   - Context + useReducer：适合中小型应用的全局状态管理，结合 reducer 模式集中管理状态更新逻辑。

   - Redux-Tollkit：大的全局状态管理工具，适合复杂、大型应用，具有良好的生态和调试工具。

   - 其他轻量状态管理工具（如 Zustand、Jotai）：性能更优、使用简单，适用于中小型项目，减少 Context 的性能开销。

选择建议：

1. 态简单：useState 或 Props。
2. 状态复杂但作用域局限：useReducer 或 Context + useReducer。
3. 态复杂且跨组件范围大：Redux Toolkit 或轻量状态管理工具（如 Zustand）。

# 五、拓展

## useEffect 🆚 useLayoutEffect

我们先看下 React 官方文档对这两个 hook 的介绍，建立个整体认识：

> **`useEffect(effect, deps?)`**
>
> 该 Hook 接收一个包含命令式、且可能有副作用代码的函数。在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性。使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会**在组件渲染到屏幕之后执行**。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道。

> **`useLayoutEffect(effect, deps?)`**
>
> 其函数签名与 useEffect 相同，但它**会在所有的 DOM 变更之后同步调用** effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

注意加粗的字段，React 官方的文档其实把两个 Hook 的执行时机说的很清楚，下面我们深入到 React 的执行流程中来理解下：

1. React 在 diff 后，会进入到 commit 阶段，准备把虚拟 DOM 发生的变化映射到真实 DOM 上

2. 在 commit 阶段的前期，会调用一些生命周期方法，对于类组件来说，需要触发组件的 getSnapshotBeforeUpdate 生命周期，对于函数组件，此时会调度 useEffect 的 create destroy 函数

3. 注意是调度，不是执行。在这个阶段，会把使用了 useEffect 组件产生的生命周期函数入列到 React 自己维护的调度队列中，给予一个普通的优先级，让这些生命周期函数异步执行

   ```tsx
   // 可以近似的认为，React 做了这样一步，实际流程中要复杂的多
   setTimeout(() => {
     const preDestory = element.destroy;
     if (!preDestory) prevDestroy();
     const destroy = create();
     element.destroy = destroy;
   }, 0);
   ```

4. 随后，就到了 React 把虚拟 DOM 设置到真实 DOM 上的阶段，这个阶段主要调用的函数是 commitWork，commitWork 函数会针对不同的 fiber 节点调用不同的 DOM 的修改方法，比如文本节点和元素节点的修改方法是不一样的。

5. commitWork 如果遇到了类组件的 fiber 节点，不会做任何操作，会直接 return，进行收尾工作，然后去处理下一个节点，这点很容易理解，类组件的 fiber 节点没有对应的真实 DOM 结构，所以就没有相关操作

6. 但在有了 hooks 以后，函数组件在这个阶段，会**同步调用**上一次渲染时 useLayoutEffect(effect, deps) create 函数返回的 destroy 函数

7. 注意一个节点在 commitWork 后，这个时候，我们已经把发生的变化映射到真实 DOM 上了

8. 但由于 JS 线程和浏览器渲染线程是互斥的，因为 JS 虚拟机还在运行，即使内存中的真实 DOM 已经变化，浏览器也没有立刻渲染到屏幕上

9. 此时会进行收尾工作，**同步执行**对应的生命周期方法，我们说的componentDidMount，componentDidUpdate 以及 useLayoutEffect(create, deps) 的 create 函数都是在这个阶段被**同步执行**。

10. 对于 react 来说，commit 阶段是不可打断的，会一次性把所有需要 commit 的节点全部 commit 完，至此 react 更新完毕，JS 停止执行

11. 浏览器把发生变化的 DOM 渲染到屏幕上，到此为止 react 仅用一次回流、重绘的代价，就把所有需要更新的 DOM 节点全部更新完成

12. 浏览器渲染完成后，浏览器通知 react 自己处于空闲阶段，react 开始执行自己调度队列中的任务，此时才开始执行 useEffect(create, deps) 的产生的函数

延伸问题：

**👉 useEffect 和 useLayoutEffect 的区别？**

- `useEffect` 在渲染时是 **异步执行**，并且要等到浏览器将所有变化渲染到屏幕后才会被执行。
- `useLayoutEffect` 在渲染时是 **同步执行**，其执行时机与 componentDidMount，componentDidUpdate 一致。



**👉  useEffect 和 useLayoutEffect 哪一个与 componentDidMount / componentDidUpdate 是等价的？**

- `useLayoutEffect`，因为从源码中调用的位置来看，`useLayoutEffect` 的 `create` 函数的调用位置、时机都和 componentDidMount，componentDidUpdate 一致，且都是被 React 同步调用，都会阻塞浏览器渲染。



**👉  useEffect 和 useLayoutEffect 哪一个与 componentWillUnmount 的是等价的？**

- 同上，`useLayoutEffect` 的 `detroy` 函数的调用位置、时机与 `componentWillUnmount` 一致，且都是同步调用。
- `useEffect` 的 `detroy` 函数从调用时机上来看，更像是 `componentDidUnmount` (注意React 中并没有这个生命周期函数)。



**👉  为什么建议将修改 DOM 的操作里放到 useLayoutEffect 里，而不是 useEffect？**

- 可以看到在流程9/10期间，DOM 已经被修改，但浏览器渲染线程依旧处于被阻塞阶段，所以还没有发生回流、重绘过程。由于内存中的 DOM 已经被修改，通过 `useLayoutEffect` 可以拿到最新的 DOM 节点，并且在此时对 DOM 进行样式上的修改，假设修改了元素的 height，这些修改会在步骤 11 和 React 做出的更改一起被一次性渲染到屏幕上，依旧只有一次回流、重绘的代价。
- 如果放在 `useEffect` 里，`useEffect` 的函数会**在组件渲染到屏幕之后执行**，此时对 DOM 进行修改，会触发浏览器再次进行回流、重绘，增加了性能上的损耗。





















