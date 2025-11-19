

# 概述

[Zustand ↪](https://zustand.docs.pmnd.rs/getting-started/introduction)  是一个 **轻量、高性能** 的 React 状态管理库，专注于以最小的心智负担实现灵活高效的状态管理。其主要特点包括：

1. **极简 API**：语法直观、学习曲线平滑，几行代码即可创建和使用全局状态。
2. **高效渲染**：基于 **Proxy** 的精确依赖追踪机制，避免无关组件的重复渲染。
3. **TypeScript 友好**：提供完善的类型推断与接口支持，开发体验出色。
4. **无需 Provider**：不依赖 React Context，无需在根组件包裹 Provider，减少层级嵌套，提升可读性。
5. **强大中间件系统**：内置持久化、日志、订阅等中间件，轻松扩展功能。

Zustand 特别适合中小型项目，或在需要 **快速开发、简化状态逻辑** 的场景中使用，帮助开发者在简洁与性能之间取得理想平衡。

## 为什么选择 Zustand？

相比于传统的状态管理方案（如 Redux），Zustand 带来一些显著优势：

- Redux 需要大量 boilerplate、action、reducer、middleware 配置，而 Zustand 几行代码即可定义状态与行为。 
- Context + useReducer 虽然也可用，但容易导致整棵树重新渲染；Zustand 通过选择器订阅仅会触发相关组件更新。
- 对于快速桌面端/原型项目、或无需复杂状态链路的场景，Zustand 为开发节省了大量时间。

但需注意：在非常大型、状态管理极其复杂（例如跨项目、微服务、复杂缓存/时序逻辑）场景下，Redux +专门组织依然可能更合适。

# 创建项目

使用 Vite 快速创建 React + TypeScript 项目并安装 Zustand：

```shell
$ pnpm create vite zustand-example --template react-ts
$ cd zustand-example
$ pnpm install
$ code .
```

# 安装 Zustand

```shell
$ pnpm add zustand
```

如果你计划使用中间件，如 Immer，请额外安装：

```shell
$ pnpm add immer
```

# 基本用法

## 创建 Zustand Store

在 store 目录下创建 Zustand 状态管理逻辑，例如 counterStore.ts：

> **`@/store/counterStore.ts`**

```ts
import { create } from "zustand";

type State = {
  count: number;
};

type Action = {
  increment: () => void;
  decrement: () => void;
};

export const useCounterStore = create<State & Action>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

说明：

- `create<State & Action>` 类型定义状态结构 +行为方法。

- `set((state) => { … })` 会浅合并更新，仅提交差异。
- 在组件中调用 hook 即可读取状态或执行行为。

## 在组件中使用

在 React 组件中，通过 `useCounterStore` 钩子访问和修改状态：

> **`@/App.tsx`**

```tsx
import { useCounterStore } from "./store/counterStore";

function Other() {
  // 仅订阅 count，避免订阅整个 store 造成不必要重渲染
  const count = useCounterStore((state) => state.count);
  return <div>count: {count}</div>;
}

export default function App() {
  const { count, increment, decrement } = useCounterStore();
  return (
    <div>
      <Other />
      <p>count: {count}</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
}
```

说明：

- `useCounterStore((state) => state.count)` 只订阅 count，若其他状态变化不会触发组件更新。
- Other 组件与 App 组件共享 store，但订阅的是不同片段，体现了状态复用能力。

## 目录结构建议

在实际项目中，可以按照功能模块组织 Zustand Store 和组件：

```tsx
src/
├── components/         # UI 组件
│   ├── Counter.tsx
│   └── UserProfile.tsx
├── store/              # Zustand Store
│   ├── counterStore.ts
│   └── userStore.ts
├── hooks/              # 自定义 Hook
│   └── useAuth.ts
├── pages/              # 页面组件
│   └── Home.tsx
└── App.tsx
```

这种结构有助于状态管理、UI 组件、路由页面分层清晰。

# 高级用法

Zustand 在基础用法之上提供了许多高级特性。

## 深层嵌套状态 - immer

假设状态对象结构如下：

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number }
    }
  }
}
```

若用传统方式更新，会像：

```ts
increment: () =>
  set((state) => ({
    deep: {
      ...state.deep,
      nested: {
        ...state.deep.nested,
        obj: { count: state.deep.nested.obj.count + 1 },
      },
    },
  })),
```

冗长且可读性差。

你可以使用 Immer 中间件简化更新：

```tsx
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type NestedState = {
	deep: {
		tips: string;
		nested: {
			obj: { count: number };
		};
	};
};
export type NestedActions = {
	increment: () => void;
};
export type NestedStore = NestedState & NestedActions;

export const useNestedStore = create(
	immer<NestedStore>((set) => ({
		deep: {
			tips: "Only update the necessary parts to avoid unnecessary re‑renders.",
			nested: {
				obj: { count: 0 },
			},
		},
		increment: () =>
			set((state) => {
				state.deep.nested.obj.count++;
			}),
	})),
);

```

> 说明：当你已安装 immer 时，Zustand 的 immer 中间件允许你在更新函数内用可变写法，内部自动转化为不可变修改。

在组件中使用：

```tsx
import { useNestedStore } from "./store/nestedStore";

function Other() {
  const count = useNestedStore((state) => state.deep.nested.obj.count); // 仅订阅 count
  return <div>count: {count}</div>;
}

export default function App() {
  const { deep, increment } = useNestedStore();
  return (
    <div>
      <Other />
      <p>count: {deep.nested.obj.count}</p>
      <button onClick={increment}>increment</button>
    </div>
  );
}
```

## 按需选择状态（Selector）

避免不必要的组件渲染。

```tsx
const count = useCounterStore((state) => state.count);
```

仅当 count 变动时，组件才更新。建议在大型 store 中将不同状态切分为不同 selector 以提升性能。  

## 中间件使用：持久化状态

例如将状态保存至 localStorage：

```tsx
import { persist } from 'zustand/middleware';

export const useCounterStore = create(
  persist<CounterState>(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'counter-storage',  // 存储名称
      storage: localStorage,    // 存储位置
    }
  )
);
```

说明：persist 中间件提供自动将状态同步至存储，刷新页面后保存状态。

## 异步操作

你也可以在 store 内执行异步任务，例如从 API 获取数据：

```tsx
interface UserState {
  user: User | null;
  fetchUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async (id) => {
    const response = await fetch(`https://api.example.com/user/${id}`);
    const data = await response.json();
    set({ user: data });
  },
}));
```

在组件中调用即可：

```tsx
const fetchUser = useUserStore((state) => state.fetchUser);
useEffect(() => {
  fetchUser("123");
}, [fetchUser]);
const user = useUserStore((state) => state.user);
```

这种模式适合与数据获取库结合。

# 常见误区 & 最佳实践

- **误区**：在组件内直接使用 const { count, increment } = useCounterStore() 而不使用 selector。这样会订阅整个 store，导致每次 store 内任意字段变化时组件都会重新渲染。推荐仅选择必要状态。
- **误区**：将所有状态集中到一个巨大的 store 中。建议将为不同业务模块拆分多个 store。

- **最佳实践**：
  - 始终使用 selector 订阅状态。
  - 将状态与行为分离、使用小范围 store。
  - 将业务逻辑放在 store 内部，组件仅负责调用，保持组件简洁。
  - 当需要深嵌状态更新时，优先考虑 Immer 或其他工具，避免手写展开操作。

# 适用 &不适用场景

**适用场景**：

- 中小型 React 应用、工具型产品、原型开发、状态逻辑中等复杂度。
- 需要快速构建、避免大量 boilerplate 的项目。
- 状态切换频繁、组件共享状态不深、性能敏感的 UI。

**不适用场景**：

- 极端大型应用、状态极其复杂、跨服务端 + 客户端大量共享状态、或需要时间旅行／多版本管理的场景。
- 团队已经使用 Redux 且有深度配置、并且状态逻辑庞大（可能仍然选择 Redux 更合适）。

# 总结

Zustand 是一个**简单、灵活且功能强大**的状态管理工具，特别适合 **React + TypeScript** 项目。它不仅提供了**直观的 API**，还能通过 **持久化、按需选择、异步操作等高级功能**进一步提升开发效率和可维护性。如果你希望摆脱繁琐的 Redux 代码并享受简洁的状态管理体验，Zustand 是一个值得尝试的选择！

