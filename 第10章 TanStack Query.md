

# 概述

**TanStack Query** 是一个专门用来在 Web 应用中 **获取、缓存、同步和更新服务器端数据** 的库。它简化了数据获取过程，使开发者能够专注于业务逻辑，而无需处理繁琐的状态管理。它会自动管理数据请求的状态（加载中 / 出错 / 拿到数据）、内置缓存机制，从而减少网络请求、提升应用性能和用户体验。它还支持分页、实时数据等复杂需求，并且能与 React、Vue 等主流框架及 Redux、Zustand 等状态管理库一起使用。

TanStack Query 用 **查询键** (queryKey) 来唯一标识一次数据请求结果，用 **查询函数** (queryFn) 来描述如何从后台接口获取数据。查询绑定这两者，返回 Promise 即可。这样，能以声明式的方式依赖异步数据源，而不是每次都亲自管理一堆状态和逻辑。

> **学习资源**：
>
> 🎬 [《100秒学会React Query》 - Fireship](https://www.bilibili.com/video/BV1ic411x7L7/)
>
> 📘 [官方英文文档 ↪](https://tanstack.com/query/latest/docs/framework/react/overview )（推荐）
>
> 📚 [中文文档 ↪](https://cangsdarm.github.io/react-query-web-i18n/react/ )（更新滞后）

# 核心概念

## [Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

```tsx
import { useQuery } from '@tanstack/react-query'

const { 
  data, 
  isLoading, 
  isError, 
  error,
  isFetching,
  refetch 
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5000, // 5秒后数据视为陈旧
  refetchOnWindowFocus: true // 窗口聚焦时自动刷新
})
```

**关键特性**：

- 自动缓存（默认5分钟）
- 后台自动刷新
- 错误重试（默认3次）
- 请求状态管理（`isLoading`/`isFetching`区别）

## [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

```tsx
import { useMutation } from '@tanstack/react-query'

const mutation = useMutation({
  mutationFn: addTodo,
  onSuccess: () => {
    queryClient.invalidateQueries(['todos'])
  },
  onError: (error) => {
    toast.error(error.message)
  }
})

// 使用
mutation.mutate({ title: 'New Todo' })
```

**最佳实践**：

- 通过 useMutation 处理数据提交、更新、删除等操作。
- 乐观更新（先更新UI再请求）。
- 错误回滚
- 并行/串行请求处理

## [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

```tsx
// 使特定查询失效
queryClient.invalidateQueries(['todos'])

// 使所有todos相关查询失效
queryClient.invalidateQueries({ queryKey: ['todos'] })

// 精确控制失效范围
queryClient.invalidateQueries({
  predicate: (query) => 
    query.queryKey[0] === 'todos' && 
    query.queryKey[1]?.status === 'done'
})
```

- **手动失效缓存数据**，触发数据重新获取，确保数据同步更新。

通过合理使用这三个核心概念，可以轻松管理 React 应用的服1务器数据。

# 安装和设置

1、创建项目

```shell
$ pnpm create vite tanstack-query-demo --template react-ts
```

2、安装 Tanstack Query

```shell
$ pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

- `@tanstack/react-query`：核心库
- `@tanstack/react-query-devtools`：调试工具 （可选）

3、配置 Provider

在应用的入口文件中，创建一个 QueryClient 实例，并使用 QueryClientProvider 将其注入到应用中：

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* 添加 React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
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

# 电商示例

https://fakestoreapi.com/docs

为了统一管理客户端的 API 请求，我们在 src 目录下创建一个 api/ 文件夹，并在其中添加一个 products.ts 文件。这个文件中包含：分页获取、单个产品获取、所有产品获取和创建产品等逻辑。

https://juejin.cn/post/7501829019407482920#heading-14