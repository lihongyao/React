# 一、概述

[Context](https://zh-hans.reactjs.org/docs/context.html) 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，当你不想在组件树中通过逐层传递 props 或者 state 的方式来传递数据时，可以使用 Context 来实现 **跨层级** 的组件数据传递。

<img src="./IMGS/props-state-flow.png" style="zoom:33%;" />

使用props或者state传递数据，数据自上而下流动（单向数据流），使用 Context，可以跨越组件进行数据传递，如下所示：

<img src="./IMGS/props-state-context.png" style="zoom: 33%;" />



# 二、API

- [`React.createContext`](https://zh-hans.reactjs.org/docs/context.html#reactcreatecontext)：创建上下文
- [`Context.Provider`](https://zh-hans.reactjs.org/docs/context.html#contextprovider)：分发
- [`Class.contextType`](https://zh-hans.reactjs.org/docs/context.html#classcontexttype)：订阅单个context
- [`Context.Consumer`](https://zh-hans.reactjs.org/docs/context.html#contextconsumer)：订阅多个context

# 三、静态传递

静态传递数据只是通过上下文将数据分发至子组件

👉 **创建上下文  `./src/context.tsx`** 

```tsx
import React from 'react';

interface ProviderProps {
  name: string;
  job: string;
}
export const AppContext = React.createContext<ProviderProps | null>(null);
```

👉 **分发数据 `./src/App.tsx`**

```tsx
import React from 'react';
import { AppContext } from './context';
import ContextValues from './components/ContextValues';

interface IProps {}
interface IState {}

class App extends React.Component<IProps, IState> {
  render(): React.ReactNode {
    return (
      <div className='App'>
        <AppContext.Provider value={{ name: '张三', job: '程序猿' }}>
          <ContextValues />
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
```

👉 **访问数据 `./src/components/ContextValues.jsx`**

```tsx
import React from 'react';
import { AppContext } from 'src/context';

interface IProps {}
interface IState {}

class ContextValues extends React.Component<IProps, IState> {
  // -- 订阅上下文
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;
  // -- 渲染函数
  render(): React.ReactNode {
    return (
      <div>
        {this.context?.name} - {this.context?.job}
      </div>
    );
  }
}

export default ContextValues;
```

# 四、动态传递

动态传递即将需要分发的数据绑定在 state 上，并且分发修改状态的方法给子组件使用。

👉  **`./src/context.ts`**

```js
import React from 'react';

interface ProviderProps {
  count: number;
  increment: Function;
}
export const AppContext = React.createContext<ProviderProps | null>(null);
```

👉 **`./src/components/ContextValues.jsx`**

```tsx
import React from 'react';
import { AppContext } from 'src/context';

interface IProps {}
interface IState {}

class ContextValues extends React.Component<IProps, IState> {
  // -- 订阅上下文
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;
  // -- 渲染函数
  render(): React.ReactNode {
    return (
      <>
        <p>Times:{this.context?.count}</p>
        {/* @ts-ignore */}
        <button type='button' onClick={this.context?.increment}>
          Tap
        </button>
      </>
    );
  }
}

export default ContextValues;
```

👉 **`./src/App.tsx`**

```tsx
import React from 'react';
import { AppContext } from './context';
import ContextValues from './components/ContextValues';

interface IProps {}
interface IState {
  count: number;
  increment: Function;
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      count: 10,
      increment: this.increment,
    };
  }
  increment = () => {
    this.setState(({ count }) => ({
      count: count + 1,
    }));
  };
  render(): React.ReactNode {
    return (
      <div className='App'>
        <AppContext.Provider value={this.state}>
          <ContextValues />
        </AppContext.Provider>
      </div>
    );
  }
}

export default App;
```

















