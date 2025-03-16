

# 概述

[Zustand >>](https://zustand.docs.pmnd.rs/getting-started/introduction)  是一个**轻量级、高性能**的 React 状态管理库，具有以下核心特点：

1. **极简 API**：上手简单，使用直观。
2. **高效更新**：基于 **Proxy** 实现状态变更追踪，避免不必要的组件重新渲染。
3. **TypeScript 友好**：提供完善的类型支持，适用于 TypeScript 项目。
4. **无 Provider 依赖**：无需在组件树外层包裹 Provider，减少嵌套，提高可读性。
5. **内置中间件**：支持持久化、日志记录等高级功能，扩展性强。

Zustand 非常适合中小型项目，尤其适用于需要**快速开发、简化状态管理**的场景。

# 创建项目

使用 Vite 快速创建 React + TypeScript 项目并安装 Zustand：

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

# 基本用法

## 创建 Zustand Store

在 store 目录下创建 Zustand 状态管理逻辑，例如 counterStore.ts：

> **`@/store/counterStore.ts`**

```ts
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

## 在组件中使用 Zustand

在 React 组件中，通过 `useCounterStore` 钩子访问和修改状态：

> **`@/App.tsx`**

```tsx
import { useCounterStore } from "./store/counterStore";

function Other() {
  const count = useCounterStore((state) => state.count); // 仅订阅 count
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

# 高级用法

Zustand 支持许多高级功能，例如

- **按需选择状态**：避免不必要的重新渲染。

  ```tsx
  const count = useCounterStore((state) => state.count);
  ```

- **中间件**：例如持久化状态。

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

- **异步操作**：例如从 API 获取数据。

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

# 总结

Zustand 是一个**简单、灵活且功能强大**的状态管理工具，特别适合 **React + TypeScript** 项目。它不仅提供了**直观的 API**，还能通过 **持久化、按需选择、异步操作等高级功能** 进一步提升开发效率和代码可维护性。如果你希望摆脱繁琐的 Redux 代码并享受简洁的状态管理体验，Zustand 是一个值得尝试的选择！

