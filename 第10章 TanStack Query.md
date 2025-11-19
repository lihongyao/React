# 概述

[TanStack Query ↪](https://tanstack.com/) 是一个专门用来在 Web 应用中 **获取、缓存、同步和更新服务器端数据** 的库。它简化了数据获取过程，使开发者能够专注于业务逻辑，而无需处理繁琐的状态管理。它会自动管理数据请求的状态（加载中 / 出错 / 拿到数据）、内置缓存机制，从而减少网络请求、提升应用性能和用户体验。它还支持分页、实时数据等复杂需求，并且能与 React、Vue 等主流框架及 Redux、Zustand 等状态管理库一起使用。

TanStack Query 用 **查询键** (queryKey) 来唯一标识一次数据请求结果，用 **查询函数** (queryFn) 来描述如何从后台接口获取数据。查询绑定这两者，返回 Promise 即可。这样，能以声明式的方式依赖异步数据源，而不是每次都亲自管理一堆状态和逻辑。

> 学习资源：
>
> 🎬 [《100秒学会React Query》 - Fireship](https://www.bilibili.com/video/BV1ic411x7L7/)
>
> 📘 [官方英文文档 ↪](https://tanstack.com/query/latest/docs/framework/react/overview )（推荐）
>
> 📚 [中文文档 ↪](https://cangsdarm.github.io/react-query-web-i18n/react/ )（更新滞后）

> 环境说明：
>
> - node：v25.1.0
> - pnpm：v10.20.0
> - Tanstack Query：v5.x

快速预览：

```tsx
import { useQuery } from '@tanstack/react-query'

function Todos() {
  const { data, isPending, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then(r => r.json()),
  })

  if (isPending) return <span>Loading...</span>
  if (error) return <span>Oops!</span>

  return <ul>{data.map(t => <li key={t.id}>{t.title}</li>)}</ul>
}

export default Todos
```

# 核心概念

这段代码片段简要地说明了 React Query 的 3 个核心概念：查询、突变、查询失效

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
      <ul>
        {query.data?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

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

这三个概念构成了 React Query 的大部分核心功能。

## [Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)

用于**获取（fetch）**服务器数据，并自动缓存、同步和更新。

```tsx
import { useQuery } from '@tanstack/react-query'

const { 
  data, 
  isPending,    // v5: 代替 isLoading，更语义化
  isFetching, 
  isError, 
  error,
  refetch 
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5000,           // 数据 5 秒内视为新鲜
  gcTime: 5 * 60 * 1000,     // v5: 替代 cacheTime，控制垃圾回收时间
  refetchOnWindowFocus: true // 聚焦窗口时重新请求
})
```

**关键特性**：

- 自动缓存与复用：同 queryKey 的请求共享结果，避免重复请求。
- Stale-While-Revalidate 模式：过期数据可立即展示，同时后台静默刷新。
- 垃圾回收时间 (gcTime)：数据多久后从缓存中清除（默认 5 分钟）。
- 错误重试：默认重试 3 次，可自定义重试逻辑。
- isPending vs. isFetching：
  - isPending：初始加载中（没有缓存）。
  - isFetching：正在获取数据（包括后台刷新）。

**最佳实践**：

- 尽量为 queryKey 使用结构化数组：['todos', { status: 'done' }]。
- 利用 select 字段优化数据结构，例如只返回必要字段。
- 使用 enabled 控制是否自动执行请求（懒加载模式）。

## [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)

用于**创建、更新或删除**服务器数据的操作。

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

**关键特性**：

- 命令式操作：用于执行非幂等操作（POST / PUT / DELETE）。
- 自动错误/成功回调：便于更新 UI 或触发缓存失效。
- 乐观更新：在服务器响应前先更新 UI，提升交互体验。
- 错误回滚：失败后自动恢复旧数据。
- 并行或串行操作：支持多个 mutation 同时或顺序执行。

```tsx
// -- 同步方式
mutation.mutate({ title: 'New Todo' })
// -- 异步方式
await mutation.mutateAsync({ title: 'New Todo' })
```

**最佳实践**：

- 搭配 onMutate / onError / onSettled 实现完整乐观更新逻辑。
- 避免在 mutationFn 中直接依赖全局状态，应显式传入参数。

## [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

通过「使缓存失效」来 **触发重新获取数据**，保持数据一致性。

```tsx
// 失效单个查询
queryClient.invalidateQueries({ queryKey: ['todos'] })

// 条件失效
queryClient.invalidateQueries({
  predicate: (query) => 
    query.queryKey[0] === 'todos' &&
    query.queryKey[1]?.status === 'done'
})
```

**关键特性**：

- 精细控制：可按 key、条件、时间段等灵活失效。
- 与 Mutation 配合：确保数据改动后页面自动刷新。
- 支持批量更新：可同时失效多个 Query。

通过合理使用这三个核心概念，可以轻松管理 React 应用的服1务器数据。

# 安装和设置

## 创建项目

```shell
$ pnpm create vite tanstack-query-demo --template react-ts
```

## 安装 Tanstack Query

```shell
$ pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

- `@tanstack/react-query`：核心库
- `@tanstack/react-query-devtools`：调试工具 （可选）

> 提示：关于调试工具的配置，可参考 [这里 ↪](https://tanstack.com/query/latest/docs/framework/react/devtools)

## 配置 Provider

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

## 配置 tailwindcss

1、安装 Tailwind CSS

```shell
$ pnpm add tailwindcss @tailwindcss/vite
```

2、配置 Vite 插件：在 vite.config.ts 配置文件中添加 @tailwindcss/vite 插件

```js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    ...
    tailwindcss(),
  ],
})
```

3、导入 Tailwind CSS：在您的 CSS 文件（通常是 index.css）中导入 Tailwind CSS 的内容

```js
@import "tailwindcss";
```

# 电商示例

数据来源：https://dummyjson.com/

## 定义接口

为了统一管理客户端的 API 请求，我们在 src 目录下创建一个 api/ 文件夹，并在其中添加一个 products.ts 文件。

这个文件中包含：分页获取、单个产品获取、所有产品获取和创建产品等逻辑。

```ts
// api/products.ts
const BASE_URL = 'https://dummyjson.com/products'


export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  thumbnail: string 
  images?: string[]
  rating?: number
}

export interface ListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface CreateProduct {
  title: string
  price: number
  description: string
  thumbnail?: string
  category: string
}

/**
 * 延迟函数，用于模拟网络耗时
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * 通用 fetch JSON 工具函数
 */
async function fetchJSON<T>(
  url: string,
  options?: RequestInit,
  delay = 300 // 默认延迟 300ms
): Promise<T> {
  if (delay > 0) await sleep(delay)

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

/**
 * 获取所有商品（仅用于调试）
 */
export async function getProducts(): Promise<ListResponse> {
  return fetchJSON<ListResponse>(BASE_URL)
}

/**
 * 获取单个商品
 */
export async function getProductByID(id: number): Promise<Product> {
  return fetchJSON<Product>(`${BASE_URL}/${id}`)
}

/**
 * 分页获取商品（每页 5 条）
 * dummyjson 支持 limit & skip 参数
 */
export async function getProductsByPage(page: number): Promise<ListResponse> {
  const limit = 5
  const skip = (page - 1) * limit
  return fetchJSON<ListResponse>(`${BASE_URL}?limit=${limit}&skip=${skip}`)
}

/**
 * 创建商品
 */
export async function createProduct(product: CreateProduct): Promise<Product> {
  return fetchJSON<Product>(BASE_URL + '/add', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

/**
 * 更新商品
 */
export async function updateProduct(
  id: number,
  product: Partial<CreateProduct>
): Promise<Product> {
  return fetchJSON<Product>(`${BASE_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number): Promise<{ isDeleted: boolean }> {
  return fetchJSON<{ isDeleted: boolean }>(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
}
```

## 界面交互

上面我们把数据请求都已经做好了，接下来就是做界面交互了，示例中的 ui 部分，我均使用 tailwindcss 实现，`src` 目录结构如下： 

```
├── src
│   ├── api
│   │   └── products.ts
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── All.tsx
│   │   ├── Page.tsx
│   │   └── Product.tsx
│   ├── index.css
│   └── main.tsx
```



https://juejin.cn/post/7501829019407482920#heading-14