

# 概述

React Query（现称为 TanStack Query）是一个用于管理 React 应用中服务器状态的库，简化了数据获取、缓存、同步和更新的过程。

> **提示**：快速了解 React Query，推荐观看 [《100秒学会React Query》 - Fireship](https://www.bilibili.com/video/BV1ic411x7L7/)

> 英文文档：https://tanstack.com/query/latest/docs/framework/react/overview *（推荐）*

> 中文文档：https://cangsdarm.github.io/react-query-web-i18n/react/ *（更新滞后）*

# 核心概念

## [Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

- 通过 useQuery 获取数据，并自动管理缓存、状态和重试机制。
- 提供**自动缓存**、**后台数据同步**、**错误处理**和**请求去抖（debounce）**等功能。

## [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

- 通过 useMutation 处理数据提交、更新、删除等操作。
- **不会自动缓存**，但可以在成功后手动更新查询数据。

## [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

- **手动失效缓存数据**，触发数据重新获取，确保数据同步更新。

通过合理使用这三个核心概念，可以轻松管理 React 应用的服1务器数据。

# 安装和设置

1）创建项目

```shell
$ pnpm create vite react-query --template react-ts && code react-query
$ pnpm install 
$ pnpm dev
```

2）安装 React Query

```shell
$ pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

- `@tanstack/react-query`：核心库
- `@tanstack/react-query-devtools`：调试工具 *（可选）*

3）配置 Provider

在应用的入口文件中，创建一个 QueryClient 实例，并使用 QueryClientProvider 将其注入到应用中：

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 添加 React Query Devtools */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
```

# 基本使用

React Query 提供了多个 Hook 来处理不同的请求场景，以下是最常用的两个：

1. **useQuery**：用于获取数据。
2. **useMutation**：用于提交或更新数据。

此代码段非常简短地说明了React查询的3个核心概念

```tsx
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>{query.data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```