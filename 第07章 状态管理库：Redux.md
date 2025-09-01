# 概览

React 的状态管理一直是一个热门话题，生态中涌现了众多优秀的库，如 Redux（及其扩展 Dva、Icestore）、Mobx、Zustand、Recoil、Jotai、Valtio、Hox 等。

从 [npmtrends >>](https://npmtrends.com/hox-vs-jotai-vs-mobx-vs-recoil-vs-redux-vs-valtio-vs-zustand) 近一年的 npm 下载趋势来看，Redux 依然是主流选择之一。因此，本文将重点介绍 Redux 的使用方法。

## Redux 是什么❓

[Redux >>](https://cn.redux.js.org/) 是一个 **JavaScript 状态管理容器**，用于管理和维护应用的可预测数据流。

> 摘自官网：Redux 是一个使用 **action** 事件来管理和更新应用状态的模式和工具库。它采用集中式 **Store** 统一管理状态，并确保状态只能以可预测的方式更新。

## 为什么要使用 Redux❓

Redux 主要用于管理 **全局状态**，即多个组件需要共享和修改的状态。

**Redux 提供了一种清晰的模式，使你能够准确理解应用状态的变化：何时、何地、为何发生，以及如何影响应用逻辑。**

此外，Redux 强调 **可预测性** 和 **可测试性**，使代码更易维护，并确保应用按预期运行。

## 什么时候应该使用 Redux❓

Redux 适用于以下场景：

- **多个组件需要共享同一状态**
- **状态需要频繁更新**（如表单、实时数据等）
- **状态更新逻辑复杂**（如涉及异步操作、缓存等）
- **项目规模较大，团队协作开发，需要标准化状态管理**

> **注意**：如果状态管理需求较简单，或大部分状态是局部的，React 内置的 useState 和 useReducer 可能是更好的选择。

## Redux 相关库和工具❓

Redux 本身是一个轻量级的 JS 库，但通常与以下工具配合使用，以提升开发效率和可维护性：

- **React-Redux（官方推荐的 React 绑定库）**

  Redux 可以与任何 UI 框架结合使用，而 [**React-Redux**](https://cn.react-redux.js.org/) 提供了一种高效方式，使 React 组件能够：

  - **访问 Redux state**（通过 useSelector 获取状态）
  - **触发 Redux 状态更新**（通过 useDispatch 发送 action）

- **Redux Toolkit（RTK）（官方推荐的 Redux 代码编写方式）**

  [**Redux Toolkit (RTK)**](https://cn.redux-toolkit.js.org/) 提供了一系列工具，使 Redux 开发更加简洁高效，包括：
  
  - **简化 Redux 代码**，减少模板代码（boilerplate）
  - **提供最佳实践**，降低出错概率
  - **内置 Immer，支持更直观的 state 变更**（可直接修改 state）
  - **集成 RTK Query，方便进行数据请求管理**
  
- **Redux DevTools（强大的 Redux 调试工具）**

  [**Redux DevTools**](https://github.com/zalmoxisus/redux-devtools-extension) 提供强大的调试功能，包括：
  
  - **查看 Redux 状态变化**
  - **回溯历史状态**（时间旅行调试）
  - **直接修改 state 进行测试**

📌 **推荐使用 Redux DevTools 扩展程序，能直观地跟踪 Redux 状态流转过程！**

# 相关概念

## 不可变性（immutable）

在 JavaScript 中，对象和数组默认是 **可变的（mutable）**，意味着可以直接修改它们的内容：

```typescript
const person = {
  name: '张三',
  car: { brand: '东风本田·思域', color: '珍珠白' }
};

// -- 修改对象内部属性（可变操作）
// -- 直接修改对象（不推荐）
person.car.color = '炫动蓝'; 
```

**为什么避免直接修改状态？**

- 能导致**状态变更难以追踪**，增加调试难度。
- 在 Redux 中，直接修改 state **不会触发 React 组件更新**，必须返回新的状态对象。

✅ **正确的不可变更新方式**

为了保证状态的可追踪性和 Redux 的正确运行，我们应该 **使用不可变（immutable）方式更新状态**，即 **创建新的对象** 而不是修改原对象：

```typescript
const updatedPerson = {
  ...person,
  car: { ...person.car, color: '蓝色' },
};
```

**🚀 使用 Redux Toolkit（RTK）自动处理不可变性**

RTK 内部使用 immer，允许你直接修改 state，但**底层仍是不可变更新**：

```tsx
const personSlice = createSlice({
  name: 'person',
  initialState: { name: '张三', car: { brand: '本田 思域', color: '白色' } },
  reducers: {
    changeCarColor: (state, action) => {
      state.car.color = action.payload; // ✅ Redux Toolkit 内部自动生成新状态
    },
  },
});
```

## 单向数据流（One-Way Data Flow）

React 采用 **单向数据流**，即 **数据只能从父组件流向子组件**。

换个角度理解，单向数据流类似于 **身份证管理**：

1. **政府（父组件）** 发放身份证（props）。
2. 如果你想修改身份证上的信息，**不能自己改**，而是要去政府申请变更。
3. **政府（父组件）** 审批后重新发放新的身份证，子组件接收更新后的数据。

**示例：React 组件的单向数据流**

```tsx
function Parent() {
  const [name, setName] = useState('张三');
  return <Child name={name} changeName={setName} />;
}

function Child({ name, changeName }: { name: string; changeName: (newName: string) => void }) {
  return (
    <div>
      <p>姓名：{name}</p>
      <button onClick={() => changeName('李四')}>修改姓名</button>
    </div>
  );
}
```

子组件无法直接修改 props，只能通过 changeName 通知父组件更新状态。

## Redux 数据流

Redux 通过 **全局 store 统一管理状态**，**数据流向是单向的**，主要流程如下：

1. **初始启动**

   - store 通过 reducer 计算初始 state，并监听变化。
   - UI 组件渲染时，从 store 读取 state。

2. **更新状态**

   - 组件 dispatch **一个 action**，例如：

     ```js
     dispatch({ type: 'counter/increment' });
     ```
   
   - Redux store **收到 action**，调用 reducer 计算新 state 并存储。

   - store **通知 UI 组件状态已更新**，触发**重新渲染**。

**Redux 数据流示意图**

<img src="./IMGs/ReduxDataFlowDiagram.gif" style="zoom: 33%;" />

1. **UI 组件** 触发 **用户操作**（如点击 Deposit $10）。
2. 触发 **事件处理函数（Event Handler）**，然后 dispatch 一个 action。
3. store 收到 action，交由 reducer 处理。
4. reducer 计算出 **新 state** 并存入 store。
5. **UI 组件收到更新的 state，重新渲染**。

## 小结

1. **不可变性**：Redux 需要**不可变更新状态**，可使用 ... 展开运算符或 Redux Toolkit（RTK）自动管理。
2. **单向数据流**：数据**从 store → 组件**，不能直接修改 store，只能 dispatch action。
3. **Redux 数据流**：dispatch action → reducer 计算 state → store 更新 state → UI 组件重新渲染。

# 三大原则

## 单一数据源

Redux 采用 **唯一的 store** 存储整个应用的状态，状态以 **对象树** 形式管理。

**为什么需要单一数据源？**

1. 状态管理集中，便于调试和回溯。
2. 组件可以直接访问 store，避免繁琐的 props 传递。

## State 是只读的

Redux 规定 **不能直接修改 state**，必须通过 **dispatch 一个 action** 来更新状态：

```js
dispatch({ type: 'INCREMENT' });
```

这样做的好处：

1. **可预测性**：所有状态变更都有明确的触发路径。
2. **可追溯性**：Redux DevTools 可以记录 action 触发历史，便于调试。
3. **单向数据流**：保证 state 的数据流向清晰，避免不可控修改。

## 使用纯函数 reducer 进行状态更新

**状态更新必须通过 reducer 这个** **纯函数** **完成**，它仅依赖：

1. **旧的 state**
2. **action 指定的变更**

```js
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}
```

**纯函数的特点**

1. **无副作用**：不能修改 state、不能执行异步操作、不能操作 DOM。
2. **返回新状态**：基于 state 和 action 计算**新状态对象**，而非修改原状态。

# Redux 术语

## Actions

Action 是一个 **描述“发生了什么”** 的普通 JavaScript 对象。Redux **数据流的唯一来源**，必须通过 dispatch(action) 发送到 store，触发 reducer 计算新 state。

我们约定，Action 的类型如下：

```typescript
interface PayloadAction<T = any> {
  type: string;
  payload: T;
}
```

语法解读：

- `type`：标识 Action 类型，推荐格式：**模块/事件名称**（如 todos/todoAdded）。
- `payload`：存放携带的数据，如 todos/todoAdded 需要传递的待办事项内容。

代码示例：

```js
const addTodoAction = {
  type: 'todos/todoAdded',
  payload: 'Learn Redux'
};
```

**👉 Action-Creators**

 **Action Creator 是一个返回 Action 对象的函数**，让代码更简洁、可维护。

```typescript
export const todoAdded = (todoText: string) => ({
  type: 'todos/todoAdded',
  payload: todoText,
});
```

> **提示**：Action Creator 不是 Redux 必须的功能，但 **推荐使用**。它能让代码更清晰、易维护，并且支持异步操作，对于简单应用，可以直接 dispatch(action)，但在实际项目中，使用 Action Creator 能提高代码质量。

## Reducers

Reducer 是 **纯函数**，用于接收 state 和 action，并返回新的 state。Reducer **不能直接修改旧的 state**，而是要 **返回一个新的 state 对象**。

例如：

```js
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.payload.amount };
    case 'DECREMENT':
      return { count: state.count - action.payload.amount };
    default:
      return state;
  }
}
```

## Store

[**Store**](https://cn.redux.js.org/api/store) 是 Redux 的 **唯一数据源**，负责管理整个应用的 **状态树（state tree）**，确保状态的集中式管理。应用中的状态始终存储在 store 内，并且只能通过 **派发（dispatch）action** 进行修改，从而保持状态的可预测性和数据流的单向性。通常，一个 Redux 应用只有 **一个 store**，以确保全局状态的统一管理。

Store 有以下职责：

- 在内部保存当前应用程序 state
- 通过 [`store.getState()`](https://cn.redux.js.org/api/store#getState) 访问当前 state;
- 通过 [`store.dispatch(action)`](https://cn.redux.js.org/api/store#dispatch) 更新状态;
- 通过 [`store.subscribe(listener)`](https://cn.redux.js.org/api/store#subscribe) 注册监听器回调;
- 通过 [`store.subscribe(listener)`](https://cn.redux.js.org/api/store#subscribe) 返回的 `unsubscribe` 函数注销监听器。

> 注意：store是只读的，Redux 没有提供直接修改数据的方法，改变state的唯一方法就是触发（**dispatch**） **action** 。

## Dispatch

dispatch(action) 是 Redux store 提供的方法，用于 **发送 action**，触发 reducer 计算并更新 state。这是 Redux **唯一修改状态的方式**。

例如：

```js
store.dispatch({ type: 'INCREMENT', payload: { amount: 1 } });
```

## Subscribe

subscribe(listener) 用于 **监听 Redux state 变化**，当 state 更新时，监听函数会被调用。通常用于 UI 组件响应 state 变化。

例如：
```js
const unsubscribe = store.subscribe(() => {
  console.log('State updated:', store.getState());
});

store.dispatch({ type: 'INCREMENT', payload: { amount: 1 } });

// 取消订阅
unsubscribe();
```

## Selectors

Selector 是一个**纯函数**，用于从 state 中提取所需的数据，减少组件的耦合，并优化性能。

如下所示：

```typescript
// → xxxSlice.ts
export const selectCount = (state: RootState) => state.counter.value;
```

在组件中，我们可以这样访问：

```tsx
import { useSelector } from 'react-redux';
const count = useSelector(selectCount);
```

也可以在使用的地方以内联的方式定义：

```typescript
const count = useSelector((state: RootState) => state.counter.value)
```

## Redux Slice

**👉  [Redux-Toolkit >>](https://cn.redux-toolkit.js.org/)**

**Slice 是 Redux Toolkit 中用于管理状态的模块化单元**，它将 **Reducer 逻辑与 Actions 结合**，通常用于拆分 Redux 状态，使其更清晰易维护。

**示例：Redux Store 配置**

```typescript
import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '@/store/slices/usersSlice'
import postsReducer from '@/store/slices/postsSlice'
import commentsReducer from '@/store/slices/commentsSlice'

export default configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer
  }
})
```

在上面的 store 配置中：

- state.users、state.posts、state.comments 分别对应 usersReducer、postsReducer、commentsReducer 处理的独立 **slice**。
- 每个 **slice reducer** 只负责管理自己状态的更新，确保 Redux 结构清晰、模块化。

## Thunk Functions

Redux **store 本身无法处理异步逻辑**，它只支持同步 dispatch 操作，并通过 reducer 计算新的 state。由于 reducer 是 **纯函数**，不能包含 **副作用**（如 API 请求、定时器等），因此 **所有异步逻辑都必须在 store 之外执行**。

为了解决这个问题，Redux 通过 **中间件（Middleware）** 来处理异步操作。Redux 的异步演进经历了以下阶段：

1. **Redux 中间件（Redux Middleware）**—— 允许拦截 dispatch 进行额外操作。
2. **redux-thunk** —— 最常见的 Redux 异步中间件，可让 dispatch 接受 **函数（Thunk）**，从而执行异步任务。
3. **Redux Toolkit 内置 Thunk** —— createAsyncThunk 简化了异步数据请求流程，自动管理 pending、fulfilled、rejected 状态。

### Middlewares

下面是几个示例，用来说明 middleware 如何使我们能够编写与 Redux store 交互的异步逻辑。

一个契机是编写 middleware 来查找特定的 action type，并在执行这些 action 时运行异步逻辑，例如以下示例：

```typescript
import { client } from '@/api/client'
// → Examples 1
const delayedActionMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/todoAdded') {
    setTimeout(() => {
      // -- 将这个 action 延迟1秒执行
      next(action)
    }, 1000)
    return
  }
  return next(action)
}
// → Exmaples 2
const fetchTodosMiddleware = storeAPI => next => action => {
  if (action.type === 'todos/fetchTodos') {
    // -- 发送 API 从服务器获取 todos
    client.get('todos').then(todos => {
      // -- 使用获取到的 todos 数据来 dispatch 一个 action
      storeAPI.dispatch({ type: 'todos/todosLoaded', payload: todos })
    })
  }
  return next(action)
}
```

试想一下，如果我们的项目有若干个异步处理，那我们就需要编写若干个中间，如果有办法可以提前编写 任何 异步逻辑，不但与 middleware 本身分开，而且仍然可以访问 `dispatch` 和 `getState` 来和 store 进行交互，那就太好了。

**假设我们实现这样的 middleware，它可以传递 函数 给 dispatch，而不是 action 对象呢？**可以让这个 middleware 判断 action 是否为函数，如果是函数，就立即调用。这样就可以在 middleware 定义之外的其他函数中编写异步逻辑了。

middleware 看起来像这样：

```typescript
import { Middleware } from 'redux';
export const asyncMiddleware: Middleware = (storeApi) => (next) => (action) => {
  if (typeof action === 'function') {
    // → 如果传入的action是一个函数
    // → 调用该函数并传入 dispatch 和 getState 作为参数
    return action(storeApi.dispatch, storeApi.getState);
  } else {
    // → 否则，它就是一个普通 action，那就继续执行
    return next(action);
  }
};
```
然后就可以像这样使用该 middleware：

```typescript
// 👉 代码片段1：注册中间件
const store = createStore(rootReducer, applyMiddleware(asyncMiddleware) /* 注册中间件*/);

// 👉 代码片段2：编写一个接收 dispatch 和 getState 作为参数的函数
const fetchSomeData = (dispatch, getState) => {
  client.get('todos').then(todos => { // → 发送一个异步 HTTP 请求
    // → 使用获取的 todos 来 dispatch action
    dispatch({ type: 'todos/todosLoaded', payload: todos })
    // → dispatch 后检查更新后的 store
    const allTodos = getState().todos
    console.log('Number of todos after loading: ', allTodos.length)
  })
}

// 👉 代码片段3：向 dispatch 传入函数
store.dispatch(fetchSomeData);
```

> **注意：** **这个异步函数 middleware 使得我们可以给 `dispatch` 传入函数 ！**在该函数中，可以编写一些异步逻辑（比如 HTTP 请求），然后在请求完成后 dispatch 一个普通的 action。

### Redux-thunk

目前，Redux 已经有了异步函数 middleware 的正式版本，称为 [**Redux “Thunk” middleware**](https://github.com/reduxjs/redux-thunk)。thunk middleware 允许我们编写以 `dispatch` 和 `getState` 作为参数的函数。thunk 函数可以包含我们想要的任何异步逻辑，并且该逻辑可以根据需要 dispatch action 以及读取 store state。

**thunk** 是一种特定类型的 Redux 函数，可以包含异步逻辑。上一小节中的 `fetchSomeData` 函数就是一个 Thunk.

实际应用中， Thunk 是使用两个函数编写的：

- 一个内部 thunk 函数，它以 `dispatch` 和 `getState` 作为参数 → *真正的Thunk函数*
- 外部创建者函数，它创建并返回 thunk 函数 → *通过外部创建函数，可以实现参数的传递*

我们来看一个例子：

```typescript
export const incrementAsync = (amount) => async (dispatch, getState) => {
  console.log('Loading...');
  // → 模拟异步操作
  const data = await new Promise((resolve) => {
    setTimeout(() => resolve(amount + 1), 2000);
  });
  // → 当异步代码执行完毕时，可以 dispatched actions
  dispatch({ type: 'counter/incrementByAmount', payload: data });
  console.log('completed!');
};
// → 我们可以像使用普通 Redux action creator 一样使用它们
store.dispatch(incrementAsync(10));
```

当你需要请求后端服务时，你可以将该调用放入 thunk 中。这是一个写得有点长的例子，所以你可以看到它是如何定义的：

```typescript
// →  外部的 thunk creator 函数
function fetchUserById(userId: string) {
  // →  内部的 thunk 函数
  return async function (dispatch: Dispatch) {
    try {
      // →  thunk 内发起异步数据请求
      const user = await userAPI.fetchById(userId);
      // →  数据响应完成后 dispatch 一个 action
      dispatch(userLoaded(user));
    } catch (err) {
      // → 如果过程出错，在这里处理
    }
  };
}
```

**👉 配置Store**

Redux thunk middleware 在 NPM 上作为一个名为 redux-thunk 的包提供。需要安装该软件包后才能在应用程序中使用：

```shell
$ npm install redux-thunk
```

安装后，我们可以在 Redux store 中使用该 middleware：

```typescript
import { AnyAction, applyMiddleware, createStore } from 'redux';
import { rootReducer } from './reducers';
import thunkMiddleware from 'redux-thunk';
import type { ThunkAction, ThunkMiddleware } from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware as ThunkMiddleware) /* 注册中间件*/
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default store;
```

## Redux DevTools（开发工具）

Redux DevTools 是一个调试工具，允许开发者查看 state 变化、回溯 action 以及进行时间旅行调试（Time Travel Debugging）。

可以通过浏览器扩展或者 composeWithDevTools 进行集成：

```js
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(reducer, composeWithDevTools());
```

# React-Redux（了解即可）

## Use-in-js

![](./IMGs/redux_basics.gif)

我们首先通过 Counter 示例帮助大家了解 Redux 在 JavaScript 中的应用。

### 创建项目

```shell
$ mkdir redux-basics && cd redux-basics && touch index.css index.html index.js && code .
```

### 编写代码

**👉  ` index.js`**

```javascript
// 👉 Get DOMs
const $ = (sel) => document.querySelector(sel);

// 👉 Actions creators
const increment = () => ({ type: 'counter/increment' });
const decrement = () => ({ type: 'counter/decrement' });
const incrementByAmount = (amount) => ({
  type: 'counter/incrementByAmount',
  payload: amount,
});
const toggleStatus = () => ({ type: 'status/toggleStatus' });

// 👉 Reduers
const counterReducer = (state = { count: 6 }, action) => {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, count: state.count + 1 };
    case 'counter/decrement':
      return { ...state, count: state.count - 1 };
    case 'counter/incrementByAmount':
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
};
const statusReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case 'status/toggleStatus':
      return { ...state, loading: !state.loading };
    default:
      return state;
  }
};

// 👉 Middlewares - 中间件
// -- 触发流程：dispatch → 中间件 → reducers
// -- 中间件使得我们可以在Redux中进行副作用操作
// -- 通常你不必单独为某一个功能构建中间件，而是创建一个统一的异步中间件来处理项目中的异步操作
// -- 使用时你需要先申请中间件增强器，然后在创建store的时候传入，如下所示：
// -- 1. const middlewareEnhancer = Redux.applyMiddleware(xxxMiddleware)
// -- 2. const store = Redux.createStore(reducer, middlewareEnhancer)
const asyncFunctionMiddleware = (storeApi) => (next) => (action) => {
  if (typeof action === 'function') {
    // → 如果传入的action是一个函数
    // → 调用该函数并传入 dispatch 和 getState 作为参数
    return action(storeApi.dispatch, storeApi.getState);
  } else {
    // → 否则，它就是一个普通 action，那就继续执行
    return next(action);
  }
};

// 👉 Create store
// → 注册中间件
const middlewareEnhancer = Redux.applyMiddleware(asyncFunctionMiddleware);
// → 合并reducers
const reducer = Redux.combineReducers({
  counter: counterReducer,
  status: statusReducer,
});
const store = Redux.createStore(reducer, middlewareEnhancer);

// 👉 Selectors
const useSelector = (fn) => {
  return fn(store.getState());
};

//  👉 CHUNKs - 异步函数
const incrementAsync = (amount) => async (dispatch, getState) => {
  const isLoading = getState().status.loading;
  if (isLoading) {
    return console.log('当前正在执行异步操作，请稍后再试...');
  }
  dispatch(toggleStatus());
  await new Promise((resolve) => {
    console.log('Loading...');
    setTimeout(() => {
      resolve();
    }, 1000);
  });
  dispatch(toggleStatus());
  dispatch(incrementByAmount(amount));
  console.log('Completed!');
};

// 👉 Render functions
const render = () => {
  const count = useSelector((state) => state.counter.count);
  $('#value').textContent = count;
};
// → 订阅Store更新
store.subscribe(render);

// 👉 Events - Dispatchs
$('#increment').onclick = () => store.dispatch(increment());
$('#decrement').onclick = () => store.dispatch(decrement());
$('#addAmount').onclick = () => {
  const value = $('#textbox').value;
  store.dispatch(incrementByAmount(Number(value) || 0));
};
$('#asyncButton').onclick = () => {
  const value = $('#textbox').value;
  store.dispatch(incrementAsync(Number(value) || 0));
};

// 👉 Enter Actions...
$('#textbox').value = 2;
render();
```

**👉  ` index.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./index.css" />
    <title>Redux basic example</title>
    <script src="https://unpkg.com/redux@latest/dist/redux.min.js"></script>
  </head>
  <body>
    <div class="app">
      <div class="row">
        <button class="button" id="increment">+</button>
        <span class="value" id="value">0</span>
        <button class="button" id="decrement">-</button>
      </div>
      <div class="row">
        <input class="textbox" id="textbox" />
        <button class="button" id="addAmount">Add Amount</button>
        <button class="button asyncButton" id="asyncButton">Add Async</button>
      </div>
    </div>
    <script src="./index.js"></script>
  </body>
</html>
```

**👉  ` index.css`**

```css
.app { height: 100vh; padding-top: 100px; }

.row { display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.button {
  font-size: 32px;
  padding: 4px 12px;
  border: 2px solid transparent;
  color: rgb(112, 76, 182);
  cursor: pointer;
  background-color: rgba(112, 76, 182, 0.1);
  border-radius: 10px;
  transition: all 0.15s;
}

.button:hover,
.button:focus  { border: 2px solid rgba(112, 76, 182, 0.4); }
.button:active { background-color: rgba(112, 76, 182, 0.2); }

.value { font-size: 78px; padding: 0 16px; font-family: 'Courier New', Courier, monospace; }

.textbox {
  font-size: 32px;
  padding: 4px;
  width: 64px;
  text-align: center;
  margin-right: 8px;
  border-radius: 10px;
}

.asyncButton { position: relative; margin-left: 8px; overflow: hidden; }
.asyncButton:after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(112, 76, 182, 0.15);
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: width 1s linear, opacity 0.5s ease 1s;
}
.asyncButton:active:after { width: 0%; opacity: 1; transition: 0s; }
```

## Use-in-React-Class

### 前置知识

在 React 中使用 Redux，主要基于 `react-redux` 库实现。在开始之前，我们先了解一下关于 React-Class-Component 相关的知识。

> *提示：现如今，Hooks 盛行，基本上我现在开发的项目都是基于 React-Hooks + TypeScript 实现的，但你仍然有必要去了解Class中的使用，不说别的，至少面试的时候面试官可能会问你。*

#### 容器组件 & 展示组件

React-Redux 将所有组件分成两大类：容器组件 / 展示组件。

**👉 展示组件**

展示组件有以下几个特征：

1. 只负责 UI 的呈现，不带有任何业务逻辑（即副作用操作）

2. 没有状态（No State）

3. 所有数据都由 Props 提供

4. 不使用任何 Redux 的 APIs

下面是一个展示组件的示例：

```react
const Button = props => (
  <button type="button">{props.text}</button>
)
```

> 提示：因为不含有状态，展示组件又称为"纯组件"，即它跟纯函数一样，纯粹由参数决定它的值。

**👉 容器组件**

容器组件的特征恰恰相反。

1. 负责管理数据和业务逻辑，不负责 UI 的呈现

2. 带有内部状态

3. 使用 Redux  的 APIs

> **结论：展示组件负责 UI 的呈现，容器组件负责管理数据和逻辑。**

React-Redux 规定，所有的展示组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。

| #                  | 展示组件                   | 容器组件                           |
| ------------------ | -------------------------- | ---------------------------------- |
| **作用**           | 描述如何展现（骨架、样式） | 描述如何运行（数据获取、状态更新） |
| **直接使用 Redux** | 否                         | 是                                 |
| **数据来源**       | props                      | 监听 Redux-state                   |
| **数据修改**       | 从 props 调用回调函数      | 向 Redux 派发 actions              |
| **调用方式**       | 手动                       | 通常由 React-Redux 生成            |

#### connect()

React-Redux 就是一个高阶组件HOC，提供 connect 方法，用于生成容器组件。

使用了 connect，就相当于 store.subscribe， 即组件订阅了 store 中的数据。

```js
import { connect } from 'react-redux'
const ContainerCounter = connect()(Counter);
```

上面代码中，Counter 是展示组件，ContainerCounter 就是由 React-Redux 通过 connect 方法自动生成的容器组件。但是，因为没有定义业务逻辑，上面这个容器组件毫无意义，只是 UI 组件的一个单纯的包装层。为了定义业务逻辑，需要给出下面两方面的信息。

1）输入逻辑：外部的数据（即 State 对象）如何转换为展示组件的参数

2）输出逻辑：用户发出的动作如何变为 Action 对象，从展示组件传出去。

因此，`connect` 方法的完整 API 如下。

```js
import { connect } from 'react-redux'

const ContainerCounter = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)
```

上面代码中，`connect` 方法接受两个参数：`mapStateToProps` 和 `mapDispatchToProps`。它们定义了 展示 组件的业务逻辑。前者负责输入逻辑，即将`state`映射到 展示 组件的参数（`props`），后者负责输出逻辑，即将用户对 展示 组件的操作映射成 Action。

#### mapStateToProps()

该函数处理数据的流入，返回一个对象， 使用 connect 函数，传入 mapStateToProps，完成 store 数据与组件的 props 绑定。

```js
const mapStateToProps = (state: RootState) => ({
    count: state.counter.count
});
```

在展示组件中可通过 `this.props.count` 访问。

#### mapDispatchToProps()

该函数处理数据的流出，返回一个对象，对象中的每一个字段都是一个 dispatch 处理函数，使用 connect 函数，传入 mapDispatchToProps，完成 dispatch 与组件的 props 绑定。

```js
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  increment: () => dispatch(increment()),
  decrement: () => dispatch(decrement()),
});
```

在展示组件中可通过 `this.props.increment()` 访问，其内部逻辑本质上就是在 dispatch 一个 action。

#### Provider

React-Redux 利用上下文 Context，提供的数据组件 Provider，使用Provider，加载数据仓库 store 即可在全局范围内使用 store。

```react
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// → React-Redux 利用上下文 Context，提供的数据组件 Provider
import { Provider } from 'react-redux';
import store from './stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 使用Provider，加载数据仓库 store 即可在全局范围内使用 store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

> **Tips：**\<Provider> 的实现原理是基于 **React-Context** 实现的。

`React-Redux` 自动生成的容器组件的代码，就类似上面这样，从而拿到`store`。

### 代码示例

需求描述：这里我们将 **Use-in-js** 里面的代码通过 React-Class 实现一遍。

#### 1. 创建Project

```shell
$ npm create vite@latest use-in-react-class  -- --template react-ts
$ cd use-in-react-class && npm install react-redux redux && code .
```

目录结构：

```
.
├── /src  
	  ├──	/components → 视图组件
	      ├── Counter.css
	  	  └──	Counter.tsx
	  ├──	/stores  
	  		├── /middlewares → 中间件
    				└── index.ts
    		├── /reducers
    				├── counterReducer.ts
    				├── index.ts → 合并Reducers
    				└── statusReducer.ts
	  	  └──	index.ts → 创建Store实例
	  ├──	App.tsx
	  ├──	main.tsx → 引入Store实例
├── ....
```

#### 2. 创建Middlewares

**`/stores/middlewares/index.ts`**

```typescript
import { Middleware } from 'redux';
export const asyncMiddleware: Middleware = (storeApi) => (next) => (action) => {
  if (typeof action === 'function') {
    // → 如果传入的action是一个函数
    // → 调用该函数并传入 dispatch 和 getState 作为参数
    return action(storeApi.dispatch, storeApi.getState);
  } else {
    // → 否则，它就是一个普通 action，那就继续执行
    return next(action);
  }
};
```

#### 3. 创建Reducers

**`counterReducer`**

```typescript
import { ActionCreator } from 'redux';
import { AppDispatch, RootState } from '..';
import { statusToggle } from './statusReducer';

// -- Define Actions
// 👉 用常量定义Action.type，减少代码敲错
const COUNTER_INCREMENT = 'counter/increment';
const COUNTER_DECREMENT = 'counter/decrement';
const COUNTER_INCREMENT_BY_AMOUNT = 'counter/incrementByAmount';

// 👉 Action 类型声明
type CounterIncrementAction = { type: typeof COUNTER_INCREMENT };
type CounterDecrementAction = { type: typeof COUNTER_DECREMENT };
type CounterIncrementByAmountAction = { type: typeof COUNTER_INCREMENT_BY_AMOUNT; payload: number };
type CounterAction = CounterIncrementAction | CounterDecrementAction | CounterIncrementByAmountAction;

// 👉 工厂模式 → 创建 Action
export const increment: ActionCreator<CounterIncrementAction> = () => ({
  type: COUNTER_INCREMENT,
});
export const decrement: ActionCreator<CounterDecrementAction> = () => ({
  type: COUNTER_DECREMENT,
});
export const incrementByAmount: ActionCreator<CounterIncrementByAmountAction> = (amount: number) => ({
  type: COUNTER_INCREMENT_BY_AMOUNT,
  payload: amount,
});

// 👉 initialState
interface CounterState {
  count: number;
}
const initialState: CounterState = { count: 0 };

// 👉 Define Reducer
const counterReducer = (
  state = initialState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return { ...state, count: state.count + 1 };
    case COUNTER_DECREMENT:
      return { ...state, count: state.count - 1 };
    case COUNTER_INCREMENT_BY_AMOUNT:
      return { ...state, count: state.count + action.payload };
    default:
      return state;
  }
};

// 👉 CHUNKs - 异步函数
export const incrementAsync = (amount: number) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const isLoading = getState().status.loading;
    if (isLoading) {
      console.log('当前正在执行异步操作，请稍后再试...');
      return;
    }
    dispatch(statusToggle());
    await new Promise((resolve) => {
      console.log('Loading...');
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
    dispatch(statusToggle());
    dispatch(incrementByAmount(amount));
    console.log('Completed!');
  };
};

export default counterReducer;
```

**`statusReducer.ts`**

```typescript
import { ActionCreator } from 'redux';

// -- Define Actions
// 1. 用常量定义Action.type，减少代码敲错
const STATUS_TOGGLE = 'status/toggle';

// 2. Action 类型声明
type StatusAction = { type: typeof STATUS_TOGGLE };

// 3. 工厂模式 → 创建 Action
export const statusToggle: ActionCreator<StatusAction> = () => ({
  type: STATUS_TOGGLE,
});

// -- initialState
interface StatusState {
  loading: boolean;
}
const initialState: StatusState = {
  loading: false,
};

// -- Define Reducer
const statusReducer = (
  state = initialState,
  action: StatusAction
): StatusState => {
  switch (action.type) {
    case STATUS_TOGGLE:
      return { ...state, loading: !state.loading };
    default:
      return state;
  }
};

export default statusReducer;
```

**👉  合并Reducers**

**`/reducers/index.ts`**

```typescript
import { combineReducers } from 'redux';

import counterReducer from './counterReducer';
import statusReducer from './statusReducer';

export const rootReducer = combineReducers({
  counter: counterReducer,
  status: statusReducer,
});
```

#### 4. 创建Store

**`/store/index.ts`**

```typescript
import { applyMiddleware, createStore } from 'redux';
import { asyncMiddleware } from './middlewares';
import { rootReducer } from './reducers';

const store = createStore(rootReducer, applyMiddleware(asyncMiddleware));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

#### 5. 创建Counter-Comps

**`/components/Counter.tsx`**

```tsx
import React, { ChangeEvent, Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../stores';
import {
  decrement,
  increment,
  incrementAsync,
  incrementByAmount,
} from '../stores/reducers/counterReducer';
import './Counter.css';

// → 处理数据的流入，返回一个对象
// → 使用 connect 函数，传入 mapStateToProps，完成store数据与组件的props绑定
const mapStateToProps = (state: RootState) => ({
  count: state.counter.count,
  loading: state.status.loading,
});

// → 处理数据的流出，返回一个对象，对象中的每一个字段都是一个dispatch处理函数
// → 使用 connect 函数，传入 mapDispatchToProps，完成dispatch与组件的props绑定
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  increment: () => dispatch(increment()),
  decrement: () => dispatch(decrement()),
  incrementByAmount: (amount: number) => dispatch(incrementByAmount(amount)),
  incrementAsync: (amount: number) => dispatch(incrementAsync(amount)),
});

// -- 类型声明
type IProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type IState = { incrementAmount: string };
class Counter extends React.Component<IProps, IState> {
  // -- constructor
  constructor(props: IProps) {
    super(props);
    this.state = {
      incrementAmount: '5',
    };
  }
  // -- methods
  getAmount = () => Number(this.state.incrementAmount) || 0;
  // -- events
  onIncrement = () => this.props.increment();
  onDecrement = () => this.props.decrement();
  onAddAmount = () => this.props.incrementByAmount(this.getAmount());
  onAddAsync = () => this.props.incrementAsync(this.getAmount());
  onInputChange = ($event: ChangeEvent<HTMLInputElement>) =>
    this.setState({
      incrementAmount: $event.target.value,
    });
  // -- renders
  render(): React.ReactNode {
    return (
      <div className='counter'>
        <div className='row'>
          <button className='button' onClick={this.onIncrement}>+</button>
          <span className='value'>{this.props.count}</span>
          <button className='button' onClick={this.onDecrement}>-</button>
        </div>
        <div className='row'>
          <input
            className='textbox'
            value={this.state.incrementAmount}
            onChange={this.onInputChange}
          />
          <button className='button' onClick={this.onAddAmount}>Add Amount</button>
          <button className='button asyncButton' onClick={this.onAddAsync}>Add Async</button>
        </div>
      </div>
    );
  }
}

// → 生成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

> **TIPs：**Counter 样式直接复制 **Use-in-js** 里的CSS样式即可。

**`App.tsx`**

```tsx
import React from 'react';
import Counter from './components/Counter';

class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='app'>
        <Counter />
      </div>
    );
  }
}

export default App;
```

#### 6. 注入Store

**`main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// → React-Redux 利用上下文 Context，提供的数据组件 Provider
import { Provider } from 'react-redux';
import store from './stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 使用Provider，加载数据仓库 store 即可在全局范围内使用 store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

## Use-in-React-Hooks

需求描述：这里我们将 **Use-in-React-Class** 里面的代码通过 React-Hooks 实现一遍，本示例大部分代码可以和上一小节的代码复用。

Hooks中，React-Redux 提供了 **`useSelector`** & **`useDispatch`** 钩子函数让后我们可以更方便灵活的去获取State以及Dispatch.

### 1. 创建Project

```shell
$ npm create vite@latest use-in-react-hooks  -- --template react-ts
$ cd use-in-react-hooks && npm install react-redux redux && code .
```

目录结构：

```
.
├── /src  
	  ├──	/components → 视图组件
	      ├── Counter.css
	  	  └──	Counter.tsx
	  ├──	/stores 
    		├── /reducers
    				├── counterReducer.ts
    				├── index.ts → 合并Reducers
    				└── statusReducer.ts
        ├── hooks.ts → useSelector & useDispatch
	  	  └──	index.ts → 创建Store实例
	  ├──	App.tsx
	  ├──	main.tsx → 引入Store实例
├── ....
```

> **提示：**
>
> - 删除了 middlewares 目录，这里我们使用 [redux-thunk >>](https://www.npmjs.com/package/redux-thunk) 来处理中间件。
> - 新增 hooks 文件，封装 useSelector & useDispatch 来读取和更新Store。

### 2. 创建Hooks

**`stores/hooks.ts`**

```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '.';

// 👉 推荐在整个应用程序中使用，而不是单纯的使用 useDispatch & useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 3. 创建Reducers

**提示：** Reducer 相关代码和示例 **Use-in-React-Class** 一致，你可以参照示例目录将其直接复制/粘贴过来使用，这里只列出修改/新增部分代码。

```typescript
// ....
import { AppThunk } from '..';
export const incrementAsync = (amount: number): AppThunk /** 指定返回类型 */ => {
  return async (dispatch, getState) => {
    const isLoading = getState().status.loading;
    if (isLoading) {
      console.log('当前正在执行异步操作，请稍后再试...');
      return;
    }
    dispatch(statusToggle());
    await new Promise((resolve) => {
      console.log('Loading...');
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
    dispatch(statusToggle());
    dispatch(incrementByAmount(amount));
    console.log('Completed!');
  };
};
// ....
```

### 4. 创建Store

> **提示：** Store 相关代码和示例 **Use-in-React-Class** 一致，你可以参照示例目录将其直接复制/粘贴过来使用，这里只列出修改/新增部分代码。

**`/store/index.ts`**

```typescript
import { AnyAction, applyMiddleware, createStore } from 'redux';
import { rootReducer } from './reducers';
import thunkMiddleware from 'redux-thunk';
import type { ThunkAction, ThunkMiddleware } from 'redux-thunk';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware as ThunkMiddleware) /* 注册中间件*/
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default store;
```

### 5. 创建Counter-Comps

> **提示：** Counter 样式代码和示例 **Use-in-React-Class** 一致，你可以直接复制/粘贴过来使用，这里只列出 **`Counter.tsx`** 文件代码.

**`/components/Counter.tsx`**

```tsx
import React, { ChangeEvent, memo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import { decrement, increment, incrementAsync, incrementByAmount } from '../stores/reducers/counterReducer';
import './Counter.css';

const Counter: React.FC = () => {
  // -- state
  const [incrementAmount, setIncrementAmount] = useState('5');
  // -- stores
  const count = useAppSelector((state) => state.counter.count);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- methods
  const getNumAmount = () => Number(incrementAmount) || 0;
  // -- events
  const onIncrement = () => dispatch(increment());
  const onDecrement = () => dispatch(decrement());
  const onAddAmount = () => dispatch(incrementByAmount(getNumAmount()));
  const onAddAsync = () => dispatch(incrementAsync(getNumAmount()));
  const onInputChange = ($event: ChangeEvent<HTMLInputElement>) => { setIncrementAmount($event.target.value) };
  // -- renders
  return (
    <div className='counter'>
      <div className='row'>
        <button className='button' onClick={onIncrement}>+</button>
        <span className='value'>{count}</span>
        <button className='button' onClick={onDecrement}>-</button>
      </div>
      <div className='row'>
        <input className='textbox' value={incrementAmount} onChange={onInputChange}/>
        <button className='button' onClick={onAddAmount}>Add Amount</button>
        <button className='button asyncButton' onClick={onAddAsync}>Add Async</button>
      </div>
    </div>
  );
};

export default memo(Counter);
```

**`App.tsx`**

```tsx
import React from 'react';
import Counter from './components/Counter';

const App: React.FC = () => (
  <div className='app'>
    <Counter />
  </div>
);

export default App;

```

### 6. 注入Store

> **提示：** 注入Store代码和示例 **Use-in-React-Class** 一致，你可以直接复制/粘贴过来使用.

# Redux-Toolkit（重点掌握）

**👉  [Redux-Toolkit >>](https://redux-toolkit.js.org/)**

**迎接审判吧！！！**

在前面的示例中，你已经看到，使用 Redux 编写代码时往往需要编写冗长的代码，比如不可变更新、action types、action creators，以及归一化的 state。尽管这些模式有其合理性，但手动编写这些代码可能会让人感到繁琐且容易出错，尤其是对于那些不确定如何编写 Redux 逻辑的开发者。

这也是 Redux 团队推出 **Redux Toolkit** 的原因。

Redux Toolkit 包含了用于构建 Redux 应用程序的核心工具和函数，简化了大多数 Redux 任务，避免了常见的错误，从而使得编写 Redux 应用程序变得更加容易。通过使用 Redux Toolkit，你不再需要手动编写大量冗长的 Redux 代码，它使得开发流程更加简洁和高效。

因此，**Redux Toolkit 已成为编写 Redux 应用程序逻辑的标准方式**，并且在实际开发中，**你应该优先使用 Redux Toolkit 来处理 Redux 相关逻辑**。

尽管如此，使用 Redux Toolkit 并不会改变我们之前所讨论的核心概念（比如 actions、reducers、store 配置、action creators 和 thunk 等），但是 **Redux Toolkit 提供了更简单、更高效的方式来编写这些代码**。

接下来，我们将通过 Redux Toolkit 再次实现之前的 Counter 示例，看看它如何简化代码并提升开发体验。

## Examples：Counters



![](./IMGs/redux_counter.gif)

### 1. 创建Project

```shell
$ pnpm create vite use-in-toolkit --template react-ts
$ cd use-in-toolkit && pnpm add @reduxjs/toolkit react-redux && code .
```

项目目录结构如下：

```ini
.
├── /src  
	  ├──	/components → 自定义组件
	      ├── /Counter
            ├── index.css
            └──	index.tsx
        └── /User
        	  └──	index.tsx
	  ├──	/store      → Redux Store
    		├── /slices → 功能，reducers & actions & chunks...
    				├── counterSlice.ts
        		└──	userSlice.ts
    		├── hooks.ts → 钩子
    		└── index.ts → 组合Reducers/创建Store实例
	  ├──	App.tsx
	  ├──	index.less
	  ├──	main.tsx → Provider-Store
├── ....
```

快捷生成：

```shell
$ mkdir -p src/components/{Counter,User} src/store/slices && touch src/components/{Counter/index.{css,tsx},User/index.tsx} src/store/{hooks.ts,index.ts} src/store/slices/{counterSlice.ts,userSlice.ts}
```

接下来我们配置一下取别名，毕竟引用路径中出现注入 **`./..`** 的符号我觉得特别扭。

**👉 `vite.config.ts`**

```shell
$ pnpm add -D @types/node
```

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

**👉 `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
  },
}
```

### 2. 创建Redux Store

**👉 `@/store/index.ts`**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import userReducer from '@/store/slices/userSlice';
import counterReducer from '@/store/slices/counterSlice';

// 👉 自动调用 combineReducers 合并 reducers
const store = configureStore({
  reducer: {
    user: userReducer,
    counter: counterReducer,
  },
});

// 👉 TypeScript：从 store 本身推断出 RootState 和 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


// 👉 定义 Chunk 类型
/**
 * AppThunk 类型定义
 * @template ReturnType - Thunk 函数的返回值类型，默认为 void
 * @param ReturnType - 返回值类型
 * @returns ThunkAction
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown, // 如果没有额外的参数，可以保持为 unknown
  UnknownAction // 如果有特定的 action 类型，可以替换为更具体的类型
>;

export default store;
```

> 提示：configureStore 方法为我们自动调用并组合（combineReducers） Reducers。

### 3. 创建Redux Slice

**👉 `@/store/slices/counterSlice.ts`**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '@/store';

// 👉 定义 CounterState 类型
export type CounterState = {
  count: number;
};

// 👉 定义常量
const DELAY_TIME = 1000; // 异步操作的延迟时间

// 👉 initialState
const initialState: CounterState = { count: 0 };

// 👉 Chunks
// → 异步更新Store，你也可以通过 createAsyncThunk 函数创建
export const incrementAsync = (amount: number): AppThunk => {
  return async (dispatch) => {
    try {
      console.log('Loading...');
      await new Promise((resolve) => setTimeout(resolve, DELAY_TIME)); // 模拟异步操作
      dispatch(incrementByAmount(amount)); // 分发同步 action
      console.log('Completed!');
    } catch (error) {
      console.error('Async operation failed:', error);
    }
  };
};

// 👉 Define Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // -- 自动生成Action：{ type: 'counter/increment' }
    increment: (state) => {
      // → Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // → 并不是真正的改变 state 因为它使用了 immer 库
      // → 当 immer 检测到 「draft state」 改变时，会基于这些改变去创建一个新的不可变的 state
      state.count += 1;
    },
    // -- 自动生成Action：{ type: 'counter/decrement' }
    decrement: (state) => {
      state.count -= 1;
    },
    // -- 自动生成Action：{ type: 'counter/incrementByAmount', payload: number }
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

// 👉 Selectors
export const selectCount = (state: RootState) => state.counter.count;

// 👉 Export Dispatchs
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 👉 Export Reducer
export default counterSlice.reducer;
```

**👉 `@/store/slices/userSlice`**

```typescript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/store';

// 👉 Define a type for the slice state
type UserInfos = { name: string; job: string };
type UserState = { loading: boolean; infos: UserInfos };

// 👉 Define the initial state using that type
const initialState: UserState = {
  infos: { name: '', job: '' },
  loading: false,
};


// 👉 Define the thunks
export const fetchUserById = createAsyncThunk<
  // → 定义返回值类型
  UserInfos,
  // → 定义参数类型
  string,
  // → 定义 Thunk-Apis 类型，比如 dispatch & getState 返回值类型
  { dispatch: AppDispatch; state: RootState }
>(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const { dispatch, getState, requestId, signal, extra } = thunkAPI;
    void requestId;
    void signal;
    void extra;
    void dispatch;
    console.log(getState());
    console.log(`USER ID is: ${userId}`);
    // -- 模拟请求
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = {
      data: {
        name: '张三',
        job: '前端工程师'
      }
    }
    return response.data
  },
)

// 👉 Define Slice
export const userSlice = createSlice({
  name: 'users',
  // -- userSlice 将从 initialState 参数推断状态类型
  initialState,
  reducers: {
    setInfos: (state, action: PayloadAction<UserInfos>) => {
      state.infos = action.payload;
    }
  },
  // → 处理异步 thunk dispatch 的每个 action
  extraReducers(builder) {
    builder
      .addCase(fetchUserById.pending, state => {
        state.loading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.infos = action.payload
      }).addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      })
  },
});

// 👉 Export actions
export const { setInfos } = userSlice.actions;
// 👉 Export Selectors
export const selectInfos = (state: RootState) => state.user.infos;
export const selectLoading = (state: RootState) => state.user.loading;
// 👉 Export Reducer
export default userSlice.reducer;
```

### 4. 创建Redux Hooks

**👉 `@/store/hooks.ts`**

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 👉 推荐在整个应用程序中使用，而不是单纯的使用 useDispatch & useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>(); 
```

### 5. 创建React Counters-Comp

**👉 `@/components/Counter/index.tsx`**

```tsx
import { ChangeEvent, memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decrement, increment, incrementAsync, incrementByAmount, selectCount } from "@/store/slices/counterSlice";
import "./index.css";

export default memo(function Counter() {
  // -- state
  const [incrementAmount, setIncrementAmount] = useState("5");
  // -- stores
  const count = useAppSelector(selectCount);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- methods
  const getNumAmount = () => Number(incrementAmount) || 0;
  // -- events
  const onIncrement = () => dispatch(increment());
  const onDecrement = () => dispatch(decrement());
  const onAddAmount = () => dispatch(incrementByAmount(getNumAmount()));
  const onAddAsync = () => dispatch(incrementAsync(getNumAmount()));
  const onInputChange = ($event: ChangeEvent<HTMLInputElement>) => setIncrementAmount($event.target.value);
  // -- renders
  return (
    <div className="counter">
      <div className="row">
        <button className="button" onClick={onIncrement}>
          +
        </button>
        <span className="value">{count}</span>
        <button className="button" onClick={onDecrement}>
          -
        </button>
      </div>
      <div className="row">
        <input className="textbox" value={incrementAmount} onChange={onInputChange} />
        <button className="button" onClick={onAddAmount}>
          Add Amount
        </button>
        <button className="button asyncButton" onClick={onAddAsync}>
          Add Async
        </button>
      </div>
    </div>
  );
});
```

**👉 `@/components/Counter/index.css`**

```css
.app {
  text-align: center;
  padding-top: 100px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.button {
  font-size: 32px;
  padding: 4px 12px;
  border: 2px solid transparent;
  color: rgb(112, 76, 182);
  cursor: pointer;
  background-color: rgba(112, 76, 182, 0.1);
  border-radius: 10px;
  transition: all 0.15s;
}

.button:hover,
.button:focus {
  border: 2px solid rgba(112, 76, 182, 0.4);
}

.button:active {
  background-color: rgba(112, 76, 182, 0.2);
}

.value {
  font-size: 78px;
  padding: 0 16px;
  font-family: 'Courier New', Courier, monospace;
}

.textbox {
  font-size: 32px;
  padding: 4px;
  width: 64px;
  text-align: center;
  margin-right: 8px;
  border-radius: 10px;
}

.asyncButton {
  position: relative;
  margin-left: 8px;
  overflow: hidden;
}

.asyncButton:after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(112, 76, 182, 0.15);
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: width 1s linear, opacity 0.5s ease 1s;
}

.asyncButton:active:after {
  width: 0%;
  opacity: 1;
  transition: 0s;
}
```

**👉 `@/components/User/index.tsx`**

```tsx
import { nanoid } from "@reduxjs/toolkit";
import { CSSProperties, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserById, selectInfos, selectLoading } from "@/store/slices/userSlice";

export default memo(function User() {
  // -- styles
  const styles: CSSProperties = {
    textAlign: "center",
  };
  // -- stores
  const infos = useAppSelector(selectInfos);
  const loading = useAppSelector(selectLoading);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- renders
  return (
    <div style={styles}>
      <p>{loading ? "Loading..." : `${infos.name} - ${infos.job}`}</p>
      {/* 这里 “fetchUserById” 的参数被自动推断为 string */}
      {/* 生成随机的ID字符串：nanoid()  */}
      <button onClick={() => dispatch(fetchUserById(nanoid()))}>Fetch Infos</button>
    </div>
  );
});
```

**👉 App.tsx**

```tsx
import Counter from "@/components/Counter";
import User from "@/components/User";

export default function App() {
  return (
    <div className="app">
      <Counter />
      <User />
    </div>
  );
}
```

### 6. 注入Store

**👉 `main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "@/App.tsx";
import store from "@/store";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 使用Provider，加载数据仓库 store 即可在全局范围内使用 store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

至此，示例代码已编辑完成，运行代码查看效果吧。

## Examples：持久化

### 安装依赖

```shell
$ pnpm add redux-persist redux-persist-transform-filter
```

### 配置Redux Store

**👉 `@/stores/index.ts`**

```ts
/**
 * Redux Store 配置入口
 * 集成 redux - persist 实现状态持久化（localStorage）
 */
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用 localStorage
import userReducer from '@/stores/slices/userSlice';
import appReducer from './slices/appSlice';

// =============================================
// 持久化配置
// =============================================
const persistConfig = {
  key: 'reduxState',     // localStorage 存储的键名
  storage,              // 使用的存储引擎（默认 localStorage）
  // whitelist: ['user'], // 可选：仅持久化指定 reducer
  // blacklist: ['app']   // 可选：排除指定 reducer
};

// 👉 合并所有 reducer 并添加持久化能力
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    app: appReducer,
    user: userReducer
  })
);

// =============================================
// Redux Store 配置
// =============================================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // 关闭序列化检查（避免 redux-persist 的警告）
    }),
});

// 👉 创建持久化 store 实例
export const persistor = persistStore(store);

// =============================================
// 类型导出（TypeScript 专用）
// =============================================
export type AppDispatch = typeof store.dispatch;  // 用于 dispatch 类型推断
export type RootState = ReturnType<typeof store.getState>; // 全局状态类型
```

**👉 `@/main.tsx`**

```tsx
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/stores';
...

createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			<App/>
		</PersistGate>
	</Provider>
);
```







