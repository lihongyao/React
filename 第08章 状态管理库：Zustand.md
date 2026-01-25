[Zustand](https://zustand.docs.pmnd.rs/) 是一个**轻量、高性能**的 React 状态管理库，专注于以最小的心智负担实现灵活高效的状态管理。

## 为什么选择 Zustand？

- **极简 API**：几行代码即可创建全局状态，学习曲线平滑
- **高性能**：基于精确依赖追踪，避免无关组件重渲染
- **TypeScript 友好**：完善的类型推断，开发体验出色
- **无需 Provider**：不依赖 React Context，减少层级嵌套
- **强大中间件**：持久化、DevTools、Immer 等开箱即用

相比 Redux 需要大量 boilerplate，Zustand 让状态管理变得简单直接。

## 快速开始

### 安装

```shell
$ pnpm add zustand
# 可选：用于深层状态更新
$ pnpm add immer
```

### 基础示例

创建 store：

```ts
// store/counterStore.ts
import { create } from "zustand";

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

在组件中使用：

```tsx
import { useCounterStore } from "./store/counterStore";

function Counter() {
  // ✅ 使用 selector 仅订阅需要的状态
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

## 核心概念

### 1. Selector 选择器

**关键点**：始终使用 selector 订阅状态，避免订阅整个 store。

```tsx
// ❌ 错误：订阅整个 store，任何字段变化都会触发重渲染
const { count, increment } = useCounterStore();

// ✅ 正确：仅订阅需要的字段
const count = useCounterStore((state) => state.count);
const increment = useCounterStore((state) => state.increment);
```

### 2. 使用 useShallow 优化数组/对象选择

当 selector 返回数组或对象时，需要使用 `useShallow` 避免不必要的重渲染：

```tsx
import { useShallow } from "zustand/react/shallow";

// ❌ 每次都会返回新数组，导致无限重渲染
const [count, increment] = useCounterStore((state) => [
  state.count,
  state.increment,
]);

// ✅ 使用 useShallow 进行浅比较
const [count, increment] = useCounterStore(
  useShallow((state) => [state.count, state.increment])
);
```

### 3. 深层状态更新 - Immer

对于嵌套对象，使用 Immer 中间件简化更新：

```ts
// store/userStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UserStore {
  user: {
    profile: {
      name: string;
      age: number;
    };
  };
  updateName: (name: string) => void;
}

export const useUserStore = create<UserStore>()(
  immer((set) => ({
    user: {
      profile: {
        name: "",
        age: 0,
      },
    },
    updateName: (name) =>
      set((state) => {
        // ✅ 可以直接修改，Immer 会处理不可变更新
        state.user.profile.name = name;
      }),
  }))
);
```

**注意**：v5 中，使用中间件时需要双括号调用 `create<Type>()(middleware(...))`。

### 4. 持久化状态

使用 `persist` 中间件将状态保存到 localStorage：

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CounterStore {
  count: number;
  increment: () => void;
}

export const useCounterStore = create<CounterStore>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "counter-storage", // localStorage key
    }
  )
);
```

### 5. DevTools 集成

开发环境下使用 Redux DevTools：

```ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCounterStore = create<CounterStore>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: "CounterStore" } // DevTools 中显示的名称
  )
);
```

### 6. 异步操作

处理异步操作时，建议添加 loading 和 error 状态：

```ts
interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

## 组合中间件

可以组合多个中间件：

```ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useStore = create<StoreType>()(
  devtools(
    persist(
      immer((set) => ({
        // store 定义
      })),
      { name: "store-storage" }
    ),
    { name: "Store" }
  )
);
```

**中间件顺序**：从外到内依次是 devtools → persist → immer → store。

## 最佳实践

### 1. 拆分 Store

按功能模块拆分多个 store，而不是使用一个巨大的 store：

```ts
// ✅ 推荐：按功能拆分
store/
  ├── counterStore.ts
  ├── userStore.ts
  └── cartStore.ts

// ❌ 不推荐：所有状态集中在一个 store
store/
  └── megaStore.ts
```

### 2. 类型定义

使用 TypeScript 接口定义 store 类型：

```ts
interface CounterStore {
  // State
  count: number;
  // Actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  // 实现
}));
```

### 3. 业务逻辑放在 Store

将业务逻辑封装在 store 内部，组件只负责调用：

```ts
// ✅ 推荐：逻辑在 store
increment: () => set((state) => {
  const newCount = state.count + 1;
  if (newCount > 10) {
    console.warn("Count too high");
  }
  return { count: newCount };
}),

// ❌ 不推荐：逻辑在组件
const handleIncrement = () => {
  const newCount = count + 1;
  if (newCount > 10) {
    console.warn("Count too high");
  }
  increment();
};
```

### 4. 避免在 Selector 中创建新对象

```tsx
// ❌ 错误：每次返回新对象，导致无限重渲染
const user = useUserStore((state) => ({
  name: state.user.name,
  age: state.user.age,
}));

// ✅ 正确：直接选择需要的字段
const name = useUserStore((state) => state.user.name);
const age = useUserStore((state) => state.user.age);

// ✅ 或使用 useShallow
const { name, age } = useUserStore(
  useShallow((state) => ({
    name: state.user.name,
    age: state.user.age,
  }))
);
```

## 常见问题

### Q: 为什么组件没有更新？

A: 检查是否正确使用了 selector。直接解构会订阅整个 store，但可能因为引用相等导致不更新。

### Q: 如何在 store 外部访问状态？

A: 使用 `getState()` 方法：

```ts
import { useCounterStore } from "./store/counterStore";

// 在非 React 组件中
const count = useCounterStore.getState().count;
useCounterStore.getState().increment();
```

### Q: 如何重置 store 状态？

A: 添加 reset 方法：

```ts
export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }), // 重置到初始状态
}));
```

## 总结

Zustand 通过极简的 API 和强大的中间件系统，为 React 应用提供了高效的状态管理方案。记住几个关键点：

1. **始终使用 selector** 订阅状态
2. **使用 useShallow** 处理数组/对象选择
3. **按功能拆分** store
4. **组合中间件** 扩展功能
5. **将业务逻辑** 放在 store 内部

对于中小型项目，Zustand 是 Redux 的优秀替代方案，既简洁又强大！
