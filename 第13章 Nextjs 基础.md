https://blog.csdn.net/jackson_mseven/category_12528926.html

https://mp.weixin.qq.com/s/x_oTytXbYLsj5bheUrulHQ

# 概述

[Next.js ↪](https://nextjscn.org/) 是一个基于 React 的全栈框架，用于快速构建高性能的服务器端渲染（SSR）和静态生成（SSG）网页应用。

本文主要记录 Next.js 的学习路程，便于日后回溯，非官方指南，中文指南请参考 [这里 ↪](https://nextjs.net.cn/)。

> 💡 提示：
>
> 1. VS Code 推荐安装插件：[Nextjs snippets ↪](https://marketplace.visualstudio.com/items?itemName=PulkitGangwar.nextjs-snippets) / [Tailwind CSS IntelliSense ↪](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)。
> 2. 您可以直接从 [Next.js 快速指南 ↪](https://nextjs.org/learn/dashboard-app) 开始了解基础用法。
> 3. 图标库：[heroicons ↪](https://heroicons.com/)
> 4. 组件库：[tailwind ui ↪](https://tailwindui.com/components)



<u>**SSR / ISR / SSG / CSR**</u>

这四个词都在回答同一个问题：**页面在哪里生成，数据什么时候更新**。

| 模式 | 简单理解 | 适合场景 |
| --- | --- | --- |
| SSR | 每次请求时，在服务器生成页面 | 用户中心、订单详情、实时数据 |
| ISR | 先生成静态页面，再按时间或事件更新缓存 | 首页、商品列表、博客文章 |
| SSG | 构建时生成静态页面，访问时直接返回 | 文档、官网、Landing Page |
| CSR | 浏览器加载 JS 后，在客户端请求数据并渲染 | 后台系统、图表、复杂表单 |

初学阶段先记这个选择思路：

1、内容几乎不变：优先 **SSG**。

2、内容会变，但不要求每秒最新：优先 **ISR**。

3、内容必须实时，或每个用户看到的不一样：使用 **SSR**。

4、强依赖浏览器交互、状态、`window`、`localStorage`：使用 **CSR** 或拆成客户端组件。

在 **Next.js 16 + App Router** 中，页面默认更推荐用 **Server Components** 负责首屏和数据获取，只把需要交互的部分写成 **Client Components**。所以不要把 SSR / ISR / SSG / CSR 当成四个互斥开关，它们经常会在同一个页面里组合使用。

# 准备工作

开发相关环境：

- `Node`：`v25.1.0`
- `pnpm`：`v10.24.0`
- `Next.js v16+` / `App Router`

在使用 pnpm 安装依赖时，可配置镜像，在根目录创建 .npmrc 文件，指定镜像源：

```
registry=http://registry.npmmirror.com
```

# 创建项目

@See https://nextjs.org/docs/app/getting-started/installation

```shell
$ pnpm create next-app@latest nextjs-learns --use-pnpm [--yes]
✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … No / 【Yes】
✔ Which linter would you like to use? › Biome
✔ Would you like to use React Compiler? … No / 【Yes】
✔ Would you like to use Tailwind CSS? … No / 【Yes】
✔ Would you like your code inside a `src/` directory? … No / 【Yes】
✔ Would you like to use App Router? (recommended) … No / 【Yes】
✔ Would you like to use Turbopack? (recommended) … No / 【Yes】
✔ Would you like to customize the import alias (`@/*` by default)? … No / 【Yes】
✔ What import alias would you like configured? … @/*
```

> 提示：`--yes` 会跳过提示，使用已保存的偏好或默认设置。

进入项目目录并启动项目：

```shell
$ code nextjs-learns
$ pnpm dev
```

# 开始

## 目录结构

@See https://nextjs.org/docs/app/getting-started/project-structure

> 温馨提示：**建议仔细阅读该章节以及 [文件系统约定 ↪](https://nextjs.org/docs/app/api-reference/file-conventions)**，熟悉 Next.js 中的文件夹和文件约定以及组织项目的提示。

基础约定文件

```
src/app
├── error.tsx        # 运行中错误
├── layout.tsx       # 布局，提供页面基础布局
├── loading.tsx      # 过渡页面
├── nout-found.tsx   # 404
└── page.tsx         # 页面
```

路由结构控制

| **特性** | **目录名**    | **用途**               |
| -------- | ------------- | ---------------------- |
| 路由分组 | `(group)`     | 不影响 URL，只组织结构 |
| 动态路由 | `[slug]`      | 单层动态变量           |
| 可变多层 | `[...slug]`   | 捕获所有多级路径       |
| 可选多层 | `[[...slug]]` | 匹配父路径及所有下级   |
| 并行路由 | `@name`       | 同时渲染多个 UI 分支   |
| 私有目录 | `_folder`     | 不会成为路由           |

### `(group)`

@See https://nextjs.org/docs/app/getting-started/project-structure#route-groups

组织页面文件，不影响最终 URL，只影响项目结构与分组

```
app/
├── (marketing)/
│   ├── about/page.tsx      # URL: /about
│   └── blog/page.tsx       # URL: /blog
└── (shop)/
    ├── products/page.tsx   # URL: /products
    └── cart/page.tsx       # URL: /cart
```

### `[slug]`

@See https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

动态路由，匹配单层动态参数

```
app/
└── blog/
    └── [slug]/
         └── page.tsx       # URL: /blog/123
```

###  `[...slug]`

@See https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#catch-all-segments

匹配 **多个层级** 的可变路径段

```
app/
└── shop/
    └── [...slug]/     # 匹配: /shop/a, /shop/a/b, /shop/a/b/c
        └── page.tsx 
 
```

###  `[[...slug]]`

@See https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes#optional-catch-all-segments

匹配父路径自身 + 多级路径，可选存在。

```
app/
└── blog/
    └── [[...slug]]/   # 匹配: /blog, /blog/a, /blog/a/b
        └── page.tsx  
```

### `@folderName`

@See https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes

多个页面同时渲染于同一布局中（如 Dashboard 布局的统计 + 列表并行渲染）。

```
app/
├── @team/
│   └── page.tsx
├── @analytics/
│   └── page.tsx
└── layout.tsx     # 可以同时渲染 team 和 analytics
```

### `_folderName`

@See https://nextjs.org/docs/app/getting-started/project-structure#private-folders

标记为 **私有**，不会成为路由的一部分。

```
app/
├── _lib/                    # 不会成为路由
│   └── utils.ts
└── dashboard/
    └── page.tsx             # URL: /dashboard
```

## 路由

@See https://nextjs.org/docs/app/building-your-application/routing

> 温馨提示：本示例主要使用 `APP Router`。

### 定义路由

Next.js 使用 **基于文件系统的路由**，文件夹与文件决定页面的 URL 结构。

一个文件夹代表一个 URL 段，**嵌套文件夹 = 嵌套路由**。

page.tsx 文件使该路由段可访问。

值得注意的是：

1. 只有存在 page.tsx 的目录才会成为可访问路由

   ```
   app/blog/page.tsx → /blog
   ```

2. 页面默认是 Server Component，如需变成 Client Component，在文件顶部添加：

   ```
   'use client'
   ```

3. 页面可以在服务端或客户端获取数据

4. 页面始终是路由的“叶子节点”，即

   - page.tsx 不能包含子路由
   - 子路由必须在其旁边的文件夹中创建

   ```
   app/dashboard/page.tsx     # OK
   app/dashboard/users/page.tsx   # OK
   app/dashboard/page.tsx/users   # ❌ 不允许
   ```

### 布局和模板

@See https://nextjs.org/docs/app/getting-started/layouts-and-pages

@See https://nextjs.org/docs/app/api-reference/file-conventions/template

`layout.tsx` 和 `template.tsx` 允许您创建在路由之间共享的UI。

1. 布局：用于在多个路由之间共享 UI，例如导航栏、侧边栏、页脚等。布局在路由切换时保持挂载，因此不会重新渲染、不会丢失内部状态，并且可以层层嵌套。
2. 模板：与布局类似，也用于包装子页面或子布局，但在路由切换时会重新创建实例。模板不会保留组件状态，DOM 会重新挂载，适合需要强制刷新 UI 的场景。

布局 = 持久 UI（状态保留）

模板 = 每次导航重新创建（状态不保留）

### 链接和导航

@See https://nextjs.org/docs/app/getting-started/linking-and-navigating

Next.js 有四种在路由之间导航的方法：

1. 使用 [\<Link>](https://nextjs.org/docs/app/api-reference/components/link) 组件 —— 预取/局部刷新/控制跳转是否滚动顶部等
2. 使用 [useRouter()](https://nextjs.org/docs/app/api-reference/functions/use-router) 钩子函数 —— 客户端组件
3. 使用 [redirect](https://nextjs.org/docs/app/api-reference/functions/redirect) 函数 —— 服务端组件
4. 使用 [History API](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api)

### 重定向

@See https://nextjs.org/docs/app/guides/redirecting

### 动态路由

@See https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes

当你无法提前确定路由段名称，并希望根据动态数据生成路由时，可以使用 **动态路由段**。这些路由段可以在请求时动态填充，或者在构建时预渲染。这种方式非常适合用于用户详情页、文章详情页等路径会随数据变化的场景。

可以通过将文件夹名称括在方括号中来创建动态分段：[folderName]。例如，[id] 或 [slug]。

假设，现在需要创建一个博客列表和博客详情页面，你可以定义如下目录结构：

```
.
└── app
    └── blogs
        ├── [slug]
        │   └── page.tsx # 博客详情页 
        └── page.tsx     # 博客列表页
```

在上述结构中：

- [slug] 是动态路由段，可以根据不同的参数生成路径，比如 /1

- 文件夹名称中的slug 会作为参数传递给页面组件，供你访问和使用。

动态段作为 params 属性传递给布局、页面、路由和生成元数据函数：

```tsx
// blogs/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="p-8 text-center">
      <h1>This is blog details of slug：{slug}</h1>
    </div>
  );
}
```

> 温馨提示：在 Next.js 中，params 是一个 Promise 属性，因此无法直接使用它的值。
>

### 并行（平行）路由

@See https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes

Next.js 的 **平行路由（Parallel Routes）** 允许在同一页面上同时渲染多个路由节点，每个节点可以独立加载和更新，适合复杂嵌套布局和多视图页面的场景。

![](./imgs/nextjs_parallel_routes_1.gif)

默认情况下，Next.js 会跟踪每个槽的活动状态，受导航类型（软导航/硬导航）影响。在平行路由页面及其子页面刷新时可能出现 404，此时可以通过定义 default.tsx 文件提供后备 UI。

### 拦截路由

@See https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes

在 Next.js 中，**拦截路由**允许在导航时临时覆盖路由行为，而不是直接跳转页面。它可以将目标页面内容以模态窗口、侧边栏或嵌套视图的形式展示，同时保留当前页面的背景。

典型场景：在产品列表页点击某个产品时，通过拦截路由弹出产品详情模态框，而路由地址更新到对应详情页，方便分享和直接访问。用户关闭模态框后，路由恢复到原页面状态。这种设计既保持页面连续性，又支持 URL 的准确性和分享性。

先看示例：

![](./imgs/nextjs_intercepting_routes.gif)

在这个场景中，我们实际上会涉及 **3 个页面**：**列表页**、**模态框** 和 **详情页**。具体来说：

1. **列表页**：这是用户首先看到的主页面，展示了所有产品的列表。
2. **模态框**：通过路由拦截实现，它实际上可以被视为一个独立的页面，只不过是在列表页的基础上以浮层（模态框）的形式叠加展示。
3. **详情页**：这是目标页面，当用户直接通过分享的链接访问时，会展示完整的产品详情内容，替代列表页。

在实现过程中，当用户在列表页点击某个产品时，利用 **路由拦截** 将目标页面以模态框形式展示，而非完全跳转到详情页。此时，页面实际上同时呈现了 **列表页** 和 **模态框**（也就是拦截的路由页面）。

这种效果可以通过 **并行路由** 来实现。并行路由允许开发者定义多个路由区域，让页面能够在主区域渲染列表的同时，在另一个区域（如模态框）渲染详情内容，从而实现多视图协同显示。

接下来，我们创建目录：

```
.
└── app/
    ├── @modal/              # 并行路由
    │   ├── (.)products/     # 拦截路由
    │   │   └── [id]/
    │   │       └── page.tsx # 拦截路由页面
    │   └── default.tsx      # 默认路由
    ├── products/            # 页面
		│   ├── [id]
 	  │		│   └── page.tsx     # 产品详情页
    │   └── page.tsx         # 产品列表页
    ├── layout.tsx           # 根路由
    └── page.tsx             # 跟页面
```

> 提示：拦截路由前面的 `(.)` 表示在当前层级中匹配 `photos` 路由，如果是返回上一级可以这样表示 `(..)`，更多路由层级匹配表示法请参考 [这里 >>](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes#convention)

直接贴代码：

```tsx
// app/@modal/default.tsx
export default function Default() {
  return null;
}
```

```tsx
// app/@modal/(.)products/[id]/page.tsx
"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [details, setDetails] = useState<any>();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    (async () => {
      const res = await fetch(`https://dummyjson.com/products/${params.id}`);
      setDetails(await res.json());
    })();
  }, [params]);

  if (!details) return null;

  return (
    <div
      className="flex justify-center items-center fixed inset-0 bg-gray-500/80 "
      onClick={router.back}
    >
      <div className="w-[300px] h-[300px] bg-white rounded-md">
        <Image
          src={details.thumbnail}
          width={300}
          height={300}
          loading="eager"
          alt={details.title}
          className="rounded-lg object-cover "
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}

```

```tsx
// app/products/page.tsx
import Image from "next/image";
import Link from "next/link";

const fetchData = async () => {
  const res = await fetch("https://dummyjson.com/products");
  return res.json();
};

export default async function Page() {
  const data = await fetchData();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {data.products.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <Image
                alt={product.title}
                src={product.thumbnail}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                width={400}
                height={800}
              />
              <h3 className="mt-4 text-sm text-gray-700">{product.title}</h3>
              <p className="mt-1 text-lg font-medium text-gray-500">
                {product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

```

```tsx
// app/products/[id]/page.tsx
import Image from "next/image";

const fetchDetails = async (id: string) => {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  return await res.json();
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const details = await fetchDetails(id);
  return (
    <div className="container mx-auto mt-8">
      <Image
        className=" rounded-lg block mx-auto"
        src={details.thumbnail}
        alt={details.title}
        width={300}
        height={300}
        loading="eager"
      />
      <div className="border-2 border-dashed border-gray-500 rounded-lg p-3 mt-6 leading-8">
        <p>
          <strong>Title：</strong>
          {details.title}
        </p>
        <p>
          <strong>Price：</strong>
          {details.price}
        </p>
        <p>
          <strong>Desc：</strong>
          {details.description}
        </p>
      </div>
    </div>
  );
}

```

```tsx
// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}

```

### 路由处理程序

@See https://nextjs.org/docs/app/api-reference/file-conventions/route

> 提示：前后端分离的应用，几乎用不到。

### 路由参数

这里主要介绍在服务端组件和客户端组件中获取 `params` 和 `query` 参数的方式：

| #           | ☁️ 服务端组件             | 💻 客户端组件        |
| ----------- | ------------------------ | ------------------- |
| 获取Params  | `props.params` — Promise | `useParams()`       |
| 获取Queries | `props.searchParams`     | `useSearchParams()` |

## 服务端组件和客户端组件

@See https://nextjs.org/docs/app/getting-started/server-and-client-components

默认情况下，App Router 中的 `layout` 和 `page` 都是 **服务端组件**。

- 服务端组件负责取数据、拼页面、减少浏览器 JS。
- 客户端组件负责交互、状态和浏览器 API。

一句话：**能放服务端就放服务端，只有需要交互时才拆成客户端组件。**

相关示例请参考 [这里 ↪](https://nextjs.org/docs/app/getting-started/server-and-client-components#examples)

### 如何使用？

需要这些能力时，使用 **客户端组件**：

- 状态和事件：`useState`、`onClick`、`onChange`
- 副作用：`useEffect`
- 浏览器 API：`window`、`localStorage`、`navigator`
- 依赖客户端能力的第三方组件

需要这些能力时，使用 **服务端组件**：

- 获取数据库或 API 数据
- 使用密钥、Token 等服务端私密信息
- 减少发送到浏览器的 JavaScript
- 做缓存、预渲染、流式返回

### 工作原理

#### **1️⃣** 在服务器端

- 服务端组件在服务器执行，结果会被编码成 **RSC Payload**。
- 客户端组件不会在这里完成交互，只会留下位置和 JS 引用。
- Next.js 结合 HTML 和 RSC Payload，让浏览器先看到首屏内容。

#### 2️⃣ 客户端（首次加载）

- 浏览器先展示 HTML。
- 再用 RSC Payload 还原组件树。
- 最后加载客户端组件的 JS，让交互生效。

#### 3️⃣ 水合作用

- **Hydration** 就是给静态 HTML 绑定事件。
- 只有客户端组件需要水合，服务端组件本身不会把组件 JS 发到浏览器。

#### 4️⃣ 后续导航

- Next.js 会预取并缓存新的 RSC Payload，让路由切换更快。
- 服务端组件需要时仍然在服务器执行；客户端组件负责浏览器里的交互更新。

### 如何启用？

在文件顶部添加 `"use client"`，这个文件导出的组件就会成为客户端组件入口。

```tsx
"use client";
```

注意：`"use client"` 是一个**边界**。标记后，该文件导入的模块和子组件也会进入客户端 bundle，所以不要随手加在大组件或整个页面上。

### 最佳实践

- 默认写服务端组件，需要交互时再拆客户端组件。
- 客户端组件越小越好，避免把整页都变成客户端 bundle。
- 服务端组件可以通过 `props` 给客户端组件传数据，但数据必须可序列化。
- Provider 尽量放深一点，只包住真正需要共享状态的区域。

## 缓存组件

@See https://nextjscn.org/docs/app/getting-started/cache-components

Cache Components 是 Next.js 16 的缓存模型：**默认动态，手动缓存稳定内容，动态内容用 Suspense 流式返回**。

它解决的是一个常见问题：页面里有些内容可以缓存，例如导航、商品列表、文章列表；有些内容必须实时，例如用户信息、购物车、搜索结果。Cache Components 允许你只缓存稳定部分，而不是把整个页面都变成静态或动态。

### 核心理解

- 默认是动态的：不加缓存时，数据按请求执行。
- 想缓存稳定内容：使用 `use cache`。
- 想控制缓存时长：使用 `cacheLife`。
- 想按需刷新缓存：使用 `cacheTag` + `revalidateTag` / `updateTag`。
- 依赖请求级数据：放进 `<Suspense>`，让页面先返回静态外壳。

### 启用功能

```ts
// next.config.ts
export default {
  cacheComponents: true,
};
```

### 缓存稳定数据

`use cache` 用来标记可缓存的组件或函数，`cacheLife` 用来设置缓存生命周期。

```ts
import { cacheLife } from "next/cache";

async function getPosts() {
  "use cache";
  cacheLife("hours");

  return fetchPosts();
}
```

适合：文章列表、商品分类、站点配置、CMS 内容等不需要每次请求都实时更新的数据。

### 标记缓存

`cacheTag` 用来给缓存打标签，后续可以按标签刷新。

```ts
import { cacheLife, cacheTag } from "next/cache";

async function getPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  return fetchPosts();
}
```

### 刷新缓存

`revalidateTag` 适合“允许短暂旧数据”的场景。它会先返回旧缓存，再在后台更新。

```ts
import { revalidateTag } from "next/cache";

revalidateTag("posts", "max");
```

适合：后台发布文章、CMS Webhook、商品信息更新。

`updateTag` 适合“写完立刻读到新数据”的场景，只能在 Server Action 中使用。

```ts
"use server";

import { updateTag } from "next/cache";

updateTag("posts");
```

适合：用户提交表单后，马上看到自己刚创建或修改的数据。

`revalidatePath` 用来刷新某个页面或布局路径。

```ts
import { revalidatePath } from "next/cache";

revalidatePath("/dashboard");
```

适合：只想刷新某个路由，而不是所有使用同一标签的数据。

### 处理动态内容

依赖 `cookies()`、`headers()`、`searchParams` 或实时 API 的内容，不要放进 `use cache`，而是放进 `<Suspense>`：

```tsx
<StaticShell />

<Suspense fallback={<Skeleton />}>
  <DynamicContent />
</Suspense>
```

这样静态外壳可以先返回，动态部分准备好后再流式传输。

### 使用建议

- 公共、稳定、可短暂过期的数据：`use cache` + `cacheLife`。
- 需要按内容刷新：`cacheTag` + `revalidateTag("tag", "max")`。
- 写操作后要马上看到新数据：Server Action 中用 `updateTag`。
- 只刷新某个页面：`revalidatePath`。
- 用户态、请求态、实时数据：不要缓存，放进 `<Suspense>` 或客户端实时同步。

## 数据获取

@See https://nextjscn.org/docs/app/getting-started/fetching-data

在 Next.js 中，数据获取优先放在 **服务端组件** 中完成。客户端组件只处理必须依赖浏览器的场景，例如交互、实时同步、`window`、`localStorage`。

一句话：**首屏数据用服务端 `fetch`，交互和实时更新交给客户端。**

### 在服务端组件获取数据

服务端组件可以直接使用原生 `fetch`、ORM 或数据库客户端获取数据。

- 适合首屏必须展示的数据。
- 可以安全使用密钥、Token、数据库连接等服务端资源。
- 默认情况下，`fetch` 响应不会被缓存；如果要缓存稳定数据，放到“缓存组件”模块处理。
- 如果需要每次请求都拿最新数据，可以使用 `{ cache: "no-store" }`。

关键写法：

```tsx
export default async function Page() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  return <PostList posts={posts} />;
}
```

如果数据来自数据库，直接在服务端组件中查询即可：

```tsx
const posts = await db.post.findMany();
```

### 在客户端组件获取数据

客户端获取数据适合这些场景：

- 数据依赖用户操作，例如点击、输入、筛选。
- 数据需要在页面停留期间持续刷新。
- 数据依赖浏览器 API，例如 `localStorage`。
- 使用 WebSocket、SSE、轮询等实时同步能力。

简单场景用原生 `fetch` 就够了：

```tsx
"use client";

useEffect(() => {
  fetch("/api/user").then(/* 更新状态 */);
}, []);
```

当客户端请求变复杂时，再考虑 SWR 或 React Query，例如：缓存共享、轮询、请求去重、乐观更新、复杂分页。

### 添加搜索和分页

搜索和分页推荐放进 URL 参数中，例如：

```txt
/dashboard/invoices?query=abc&page=2
```

这样有三个好处：

- 可以复制、分享、刷新页面后保持状态。
- 服务端组件可以直接根据参数获取首屏数据。
- 浏览器前进后退行为更自然。

服务端组件读取参数：

```tsx
export default async function Page({ searchParams }) {
  const { query, page } = await searchParams;
}
```

客户端组件更新参数：

```tsx
const params = new URLSearchParams(searchParams);
params.set("query", value);
router.replace(`${pathname}?${params.toString()}`);
```

### 流式传输

如果某段数据很慢，不要阻塞整个页面。把慢组件放进 `<Suspense>`，让其他内容先展示：

```tsx
<Header />

<Suspense fallback={<Skeleton />}>
  <SlowList />
</Suspense>
```

总结一下：

| 场景 | 推荐方式 |
| --- | --- |
| 首屏数据 | 服务端组件 + `fetch` |
| 私密数据 | 服务端组件 |
| 搜索分页 | URL 参数 + 服务端获取 |
| 用户交互后加载 | 客户端组件 + `fetch` |
| 实时同步 | 客户端组件 + 轮询 / WebSocket |
| 稳定公共数据缓存 | `use cache` / `cacheLife` |

## 更新数据

@See https://nextjs.org/docs/app/getting-started/updating-data

Next.js 提供了 **Server Actions** 来在服务端直接更新数据，但在 **前后端分离** 的项目中几乎不用，因为前端通常通过独立 API 与后端交互。

> 温馨提示：了解 Server Actions 的概念即可，无需深入使用。

## 缓存和重新验证

@See https://nextjscn.org/docs/app/getting-started/caching-and-revalidating

@See https://nextjscn.org/docs/app/guides/caching#request-memoization

缓存和重新验证解决的是两个问题：

- **缓存**：相同数据不要每次都重新请求。
- **重新验证**：数据变了以后，让缓存失效或后台刷新。

一句话：**公共稳定数据可以缓存，用户态和实时数据不要缓存。**

### `fetch` 缓存

默认情况下，`fetch` 不会缓存响应。如果某个接口是公共且稳定的，可以显式缓存：

```ts
await fetch("/api/products", {
  cache: "force-cache",
});
```

适合：商品分类、文章列表、站点配置、公共字典等。

### 周期刷新

如果数据不需要实时，但也不能长期不更新，可以设置重新验证时间：

```ts
await fetch("/api/products", {
  next: { revalidate: 3600 },
});
```

表示最多缓存 3600 秒，到期后重新获取数据。

### revalidateTag

如果多处页面都依赖同一类数据，可以给请求打标签：

```ts
await fetch("/api/posts", {
  next: { tags: ["posts"] },
});
```

数据变更后，在 Next.js 的服务端逻辑中刷新这个标签：

```ts
import { revalidateTag } from "next/cache";

revalidateTag("posts", "max");
```

`"max"` 表示 stale-while-revalidate：先返回旧缓存，再后台刷新新数据。

在前后端分离项目中，独立后端不能直接调用 `revalidateTag`。如果后端数据更新后需要通知 Next.js，通常做法是让后端请求一个 Next.js Route Handler，再由 Route Handler 调用 `revalidateTag`。

```ts
// app/api/revalidate/route.ts
revalidateTag("posts", "max");
```

### updateTag

`updateTag` 会立即让标签缓存失效，适合“写完马上读到新数据”的场景。

但它只能在 **Server Action** 中使用：

```ts
"use server";

import { updateTag } from "next/cache";

updateTag("posts");
```

前后端分离项目通常不需要默认使用 `updateTag`。除非你让 Next.js Server Action 作为 BFF，先调用后端写接口，再调用 `updateTag`。

### revalidatePath

如果只想刷新某个页面或布局路径，可以使用 `revalidatePath`：

```ts
import { revalidatePath } from "next/cache";

revalidatePath("/dashboard");
```

适合：后台修改配置后，只刷新某个页面。

### 前后端分离建议

| 场景 | 推荐 |
| --- | --- |
| 公共稳定数据 | `force-cache` / `next.revalidate` / Cache Components |
| 用户态数据 | 不缓存，按请求获取 |
| 实时数据 | 不缓存，客户端实时同步 |
| 后端内容更新后刷新缓存 | 后端调用 Next Route Handler，再 `revalidateTag` / `revalidatePath` |
| Next Server Action 自己发起写操作 | 可用 `updateTag` |

不要为了使用缓存 API 强行引入 Server Actions。前后端分离时，业务写入仍然交给独立后端；Next.js 只负责读取、缓存和必要时刷新自己的缓存。

## 代理

@See https://nextjscn.org/docs/app/api-reference/file-conventions/proxy

`proxy.ts` 是 Next.js 16 中替代 `middleware.ts` 的文件约定。它会在路由渲染前执行，用来做轻量的请求拦截和转发控制。

一句话：**Proxy 是路由前的轻量代理层，不是业务后端。**

### 能做什么？

- `redirect`：重定向到其他页面。
- `rewrite`：改写到其他路由，但浏览器地址不变。
- 修改请求头或响应头。
- 读取或设置 Cookie。
- 直接返回响应，例如未登录返回 401。

### 基本写法

在项目根目录或 `src` 下创建 `proxy.ts`：

```ts
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.next();
}
```

通过 `matcher` 指定哪些路径会进入 Proxy：

```ts
export const config = {
  matcher: "/dashboard/:path*",
};
```

### 常见场景

#### 登录态拦截

```ts
if (!request.cookies.get("token")) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

#### 路由改写

```ts
return NextResponse.rewrite(new URL("/dashboard/user", request.url));
```

#### 设置响应头

```ts
const response = NextResponse.next();
response.headers.set("x-from-proxy", "true");
return response;
```

#### 注意事项

- Proxy 会在路由渲染前执行，命中范围要用 `matcher` 控制好。
- 不要在 Proxy 中写复杂业务逻辑。
- 不要把 Proxy 当成统一后端接口代理。
- 复杂鉴权、数据库操作、写操作，应该放在后端服务、Route Handler 或 Server Action 中。
- Proxy 默认使用 Node.js Runtime，`runtime` 配置不可用。

### 前后端分离建议

在前后端分离项目中，Proxy 主要适合做前端层面的轻量控制：

| 场景 | 是否适合 Proxy |
| --- | --- |
| 未登录跳转登录页 | 适合 |
| 路由重写、灰度入口、国际化跳转 | 适合 |
| 给请求或响应加少量 Header | 适合 |
| 调后端接口做复杂鉴权 | 不适合 |
| 承载业务 API 代理 | 不适合 |
| 数据库查询、写入、复杂计算 | 不适合 |

官方也建议不要过度依赖 Proxy，只有在路由前必须拦截请求时再使用。

## 加载UI和流式传输

@See https://nextjs.org/docs/app/api-reference/file-conventions/loading

通过 loading.tsx 可以使用 React Suspense 创建有意义的加载UI（比如 骨架图），基于此，可以在加载路由内容时显示服务器的即时加载状态，渲染完成后，将自动切入新内容。

![](./imgs/nextjs_loading_ui.avif)

现在，我们模拟渲染一个列表：

```tsx
// app/page.tsx
import React from "react";
import mockjs from "mockjs";
import Image from "next/image";

async function fetchData() {
  // -- 模拟耗时
  await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
  // -- 模拟数据
  return mockjs.mock({
    code: 200,
    message: "success",
    "data|5": [
      {
        "id|+1": 1,
        title: "@title",
        cover: "@Image('80x80','@color')",
        description: "@paragraph",
      },
    ],
  });
}

export default async function Page() {
  const res = await fetchData();
  return (
    <div className="container mx-auto p-8 space-y-4">
      {res.data.map((item: any) => (
        <div className="flex" key={item.id}>
          <div className="w-20 h-20 shrink-0 relative mr-4">
            <Image className="object-cover rounded-md" src={item.cover} fill alt="cover" sizes="80px" />
          </div>
          <div className="flex-1">
            <div className="text-gray-900 truncate">{item.title}</div>
            <div className="line-clamp-2 text-sm text-gray-400">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

代码片段中，模拟请求耗时 3s，当导航到当前路由时，页面将会出现 3s 的空白，然后再渲染如下内容：

![](./imgs/nextjs_streaming_1.jpg)

严格上来说，这样的交互是不太友好的，此时我们应该使用流式传输来实现备用 ui，首先我们创建文件：`/app/ui/Skeletons.tsx`，文件代码如下：

```tsx
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function HeroSkeleton() {
  return (
    <div className={`${shimmer} relative container mx-auto p-8 space-y-4`}>
      {Array.from({ length: 5 })
        .fill(0)
        .map((_, index) => (
          <div className="flex" key={index}>
            <div className="w-20 h-20 shrink-0 relative mr-4 bg-gray-200 rounded-md"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded-md mb-2"></div>
              <div className="space-y-1">
                <div className="w-full h-4 bg-gray-200 rounded-md"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
```

> 提示：
>
> 1. 为了使 tailwindscss 样式生效，我们需在 `tailwind.config.ts`  配置文件中将 `ui` 目录加入配置项。
>
>    ```tsx
>    {
>      "content": [
>        ...
>        "./src/ui/**/*.{js,ts,jsx,tsx,mdx}"
>        ...
>    	]
>    }
>    ```
>
> 2. 代码片段中定义了 `shimmer` 动画，此时我们还需要在 `tailwind.config.ts` 文件中添加一个帧动画配置
>
>    ```tsx
>    import type { Config } from "tailwindcss";
>    export default {
>      ...
>      theme: {
>        // -- 定义动画
>        keyframes: { shimmer: { '100%': { transform: 'translateX(100%)' } } },
>      },
>    } satisfies Config;
>    ```
>
> 3. ...

接下来，我们在 `page.tsx` 同级目录里中，创建 `loading.tsx`，并填入如下代码：

```tsx
import { HeroSkeleton } from "@/ui/Skeletons";
import React from "react";

export default function Loading() {
  return <HeroSkeleton />;
}
```

渲染效果如下：

![](./imgs/nextjs_streaming_2.gif)

流式传输允许你将页面的 HTML 分解为更小的块，并逐步将这些块从服务器发送到客户端。

![](./imgs/nextjs_streaming_3.avif)

这使得页面的某些部分能够更快地显示，而无需等待所有数据加载后才能呈现任何 UI。

现在，我们将刚刚页面（`app/page.tsx`）中的代码提取到 `ui/HeroList.tsx` 中，然后修改页面代码如下：

```tsx
import React from "react";
import HeroList from "@/ui/HeroList";

export default async function Page() {
  return <HeroList />;
}
```

再次刷新页面，可以看到相同的效果，这种方式可以使得我们更细腻话的去控制组件的加载。

## 错误处理

@See https://nextjs.org/docs/app/getting-started/error-handling

错误可以分为两类：预期的错误和未捕获的异常：

1. **预期的错误通过返回值处理**：对于服务器端的操作（Server Actions），避免使用 try/catch 来处理预期会发生的错误，而是通过 useActionState 来管理这些错误，并将错误信息返回给客户端。
2. **未预期的异常用错误边界处理**：对于未预期的异常，使用错误边界（Error Boundaries）来处理。可以通过 error.tsx 和 global-error.tsx 文件来实现错误边界，并提供备用的界面显示（Fallback UI）。

### 处理预期错误

预期的错误是指在应用程序正常运行中可能发生的错误，例如服务器端表单验证失败或请求失败。这类错误应该被明确处理，并返回给客户端。

#### 处理服务端操作中的预期错误

使用 useActionState 钩子管理服务器端操作（Server Actions）的状态，包括错误处理。通过这种方式，可以避免使用 try/catch 块来处理预期的错误。这些错误应被设计为返回值，而不是抛出异常。

![](./imgs/nextjs_server_error.jpg)

特别是在表单操作当中，假设输入账号或密码错误，应该给出相应的提示信息，而不是直接抛出异常，触发错误边界，如下所示：

```tsx
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export type State = {
  usernameErrorMsg?: string;
  passwordErrorMsg?: string;
}

export async function login(prevState: State, formData: FormData) {

  const username = formData.get('username')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  if (!/^1[3-9]\d{9}$/.test(username)) return { usernameErrorMsg: '手机号格式错误' }
  if (username !== '15888888888') return { usernameErrorMsg: '手机号不存在' }
  if (password !== '1234') return { passwordErrorMsg: '密码错误' }
  await new Promise((resolve) => setTimeout(resolve, 3000));

  revalidatePath('/dashboard');
  redirect('/dashboard');

}
```

接下来，我们可以将操作传递给 `useActionState` 钩子并使用返回的状态来显示错误消息。

```tsx
"use client";

import React, { useActionState } from "react";
import { login, State } from "@/actions";

export default function Login() {
  const initialState: State = { usernameErrorMsg: "", passwordErrorMsg: "" };
  const [state, formAction, isPending] = useActionState(login, initialState);
  return (
    <div className="h-lvh w-lvw flex justify-center items-center">
      <div className="px-10 py-6 bg-gray-100 rounded-md">
        <h1 className="text-blue-500 mb-4 text-2xl">登录</h1>
        <form action={formAction} className="space-y-4">
          {/* 账号 */}
          <div>
            <div>
              <label htmlFor="username">账号：</label>
              <input 
                type="tel" 
                id="username" 
                name="username" 
                placeholder="登录账号（手机号）" 
                className="p-1" 
                required 
                maxLength={11} 
              />
            </div>
            <p className="text-red-500 mt-1" aria-live="polite">
              {state?.usernameErrorMsg}
            </p>
          </div>
          {/* 密码 */}
          <div>
            <div>
              <label htmlFor="password">密码：</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="登录密码" 
                className="p-1" 
                required 
                maxLength={20} 
              />
            </div>
            <p className="text-red-500" aria-live="polite">
              {state?.passwordErrorMsg}
            </p>
          </div>
          {/* 登录按钮 */}
          <button type="submit" className="w-full h-10 bg-blue-500 text-white rounded-md mt-20">
            {isPending ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

![](./imgs/nextjs_server_error_toast.jpg)

> 温馨提示：你也可以使用返回的状态在客户端显示 toast 提示。

#### 处理服务器组件的预期错误

在服务器组件内部获取数据时，可以根据响应有条件地呈现错误消息或重定向。

```tsx
export default async function Page() {
  const res = await fetch('https://...');
  const data = await res.json();
  if (!res.ok) {
    return "There was an error.";
  }

  return "...";
}

```

### 未捕获的异常

未捕获的异常属于意外错误，表示在应用程序正常流程中不应发生的错误或问题。这些应该通过抛出错误来处理，然后错误边界会捕获错误。

1. 常见处理方式：使用 error.tsx 处理根布局下未捕获的错误（错误边界）。
2. 可选处理方式：使用嵌套的 error.tsx 文件（例如 app/dashboard/error.tsx）处理细粒度的未捕获错误。
3. 不常见的处理方式：<del>使用 global-error.js 处理根布局中未捕获的错误（全局错误）。</del>

#### 错误边界

@Seehttps://nextjs.org/docs/app/getting-started/error-handling#using-error-boundaries

Next.js 使用错误边界来处理未捕获的异常。错误边界捕获子组件中的错误并显示后备 UI，而不是崩溃的组件树。

## 样式

@See https://nextjs.org/docs/app/building-your-application/styling

推荐使用 [tailwindscss](https://tailwindcss.com/) + [clsx](https://www.npmjs.com/package/clsx) 

1. Tailwind 是一个 CSS 框架，允许您直接在 TSX 标记中快速编写实用程序类 ，从而加快开发过程。
2. clsx 是一个可让您轻松切换类名称的库。

在 Tailwind 配置文件中，添加将使用 Tailwind 类名的文件的路径，参考 [这里 >> ](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css#configuring-tailwind)

## 优化

### 固定宽高比

固定宽高比主要用于避免图片、卡片、视频加载时撑开页面，减少布局抖动。

```tsx
<div className="aspect-[16/9] w-full bg-gray-200" />
```

> 注意：`aspect-ratio` 只设置比例，不设置实际尺寸。元素仍然需要宽度或高度。

结合 `next/image` 的 `fill` 使用时，父容器必须有尺寸，并设置 `relative`：

```tsx
<div className="relative aspect-[1920/560] w-full">
  <Image fill src="/images/banner.png" alt="banner" className="object-cover" />
</div>
```

如果在 `flex` 布局中被文字高度拉伸，可以给图片区域单独套一层固定宽度容器：

```tsx
<div className="flex">
  <div className="w-[30%] shrink-0">
    <div className="aspect-[4/3]" />
  </div>
  <div className="flex-1">...</div>
</div>
```

### 图片

@See https://nextjscn.org/docs/app/getting-started/images

@See https://nextjscn.org/docs/app/api-reference/components/image

Next.js 推荐使用 `next/image` 的 `<Image>` 组件。它相比原生 `<img>` 多了几个能力：自动尺寸优化、现代图片格式、懒加载、防止布局偏移、支持远程图片优化。

本地图片可以直接放在 `public` 目录，通过 `/` 引用：

```tsx
import Image from "next/image";

<Image src="/profile.png" alt="profile" width={500} height={500} />;
```

远程图片必须提供 `width` / `height`，并在 `next.config.ts` 中配置允许的域名：

```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};
```

使用 `fill` 时，父容器要有尺寸：

```tsx
<div className="relative aspect-[16/9]">
  <Image fill src="/cover.png" alt="cover" sizes="100vw" />
</div>
```

图片优化要点：

- 所有图片都要写有意义的 `alt`。
- 已知尺寸时优先使用 `width` / `height`。
- 铺满容器时使用 `fill` + `sizes`。
- 远程图片的 `remotePatterns` 尽量写具体，避免放开整个域名。

### 字体

@See https://nextjscn.org/docs/app/getting-started/fonts

Next.js 推荐使用 `next/font` 加载字体。它会自动自托管字体，减少外部请求，并降低字体加载导致的布局偏移。

Google 字体：

```tsx
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
```

本地字体：

```tsx
import localFont from "next/font/local";

const myFont = localFont({
  src: "./my-font.woff2",
});
```

建议：优先使用可变字体；全局字体放在 Root Layout 中。

### 元数据

@See https://nextjscn.org/docs/app/getting-started/metadata-and-og-images

Metadata API 用来生成页面的 `<head>` 信息，主要用于 SEO 和社交分享。

静态元数据：

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Blog",
  description: "A blog built with Next.js",
};
```

动态元数据：

```tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.description,
  };
}
```

注意：

- `metadata` 和 `generateMetadata` 只支持服务端组件。
- `favicon.ico`、`robots.txt`、`sitemap.xml`、`opengraph-image` 等可以使用文件约定。
- 动态页面的元数据可以流式生成，不阻塞主要 UI 渲染。

### 静态资源

@See https://nextjscn.org/docs/app/api-reference/file-conventions/public-folder

静态资源放在项目根目录的 `public` 文件夹中，可以通过根路径 `/` 访问。

```txt
public/avatar.png -> /avatar.png
```

示例：

```tsx
<Image src="/avatar.png" alt="avatar" width={64} height={64} />
```

注意：

- `public` 适合放图片、字体、下载文件等静态资源。
- `public` 下的文件不会被安全地长期缓存，默认缓存头是 `Cache-Control: public, max-age=0`。
- `favicon.ico`、`robots.txt`、`sitemap.xml` 等元数据文件，优先使用 `app` 目录下的特殊文件约定。

## 配置

### 环境变量

@See https://nextjscn.org/docs/app/guides/environment-variables

Next.js 内置支持环境变量，核心就两类：

| 类型 | 说明 |
| --- | --- |
| 服务端环境变量 | 默认只在服务端可用，例如数据库地址、密钥、Token |
| 客户端环境变量 | 必须以 `NEXT_PUBLIC_` 开头，会被打包进浏览器 JS |

一句话：**不加 `NEXT_PUBLIC_` 就只给服务端用，加了就会暴露给浏览器。**

#### .env 文件中加载环境变量

在项目根目录创建 `.env` 文件，注意不是 `/src` 目录。

```ini
DB_HOST=localhost
DB_USER=admin
DB_PASS=123456
```

在服务端组件、Route Handler、Server Action 中都可以读取：

```ts
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
```

注意：

- `.env*` 文件应放在项目根目录。
- 不要把包含密钥的 `.env.local` 提交到仓库。
- 如果要在 Next.js 运行时之外加载环境变量，例如 ORM 配置、测试配置，可以使用 `@next/env`。

```ts
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
```

环境变量支持引用其他变量：

```ini
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

如果值里真的需要 `$`，需要写成 `\$`。

#### 浏览器中获取环境变量

如果变量需要在浏览器中使用，必须加 `NEXT_PUBLIC_` 前缀：

```ini
NEXT_PUBLIC_PLATFORM=PC
```

客户端组件中可以读取：

```tsx
"use client";

console.log(process.env.NEXT_PUBLIC_PLATFORM);
```

注意：`NEXT_PUBLIC_` 会在 `next build` 时被内联到客户端 bundle 中。构建完成后，浏览器里的值不会再随着服务器环境变量变化。

下面这种动态读取不会被内联：

```tsx
const key = "NEXT_PUBLIC_PLATFORM";
const value1 = process.env[key];

const env = process.env;
const value2 = env.NEXT_PUBLIC_PLATFORM;
```

如果浏览器需要运行时环境变量，不要依赖 `NEXT_PUBLIC_`，而是通过接口返回。

#### 默认环境变量

常见文件：

| 文件 | 说明 |
| --- | --- |
| `.env` | 所有环境默认值 |
| `.env.local` | 本地覆盖，通常不提交 |
| `.env.development` | 开发环境 |
| `.env.production` | 生产环境 |
| `.env.test` | 测试环境 |

`NODE_ENV` 只允许三个值：`development`、`production`、`test`。

如果没有手动设置，`next dev` 会使用 `development`，其他命令通常使用 `production`。

#### 测试环境的环境变量

测试环境使用 `.env.test`。为了保证测试结果一致，`NODE_ENV=test` 时不会加载 `.env.local`。

#### 环境变量加载顺序

Next.js 会按顺序查找环境变量，找到后停止：

1. `process.env`
2. `.env.$(NODE_ENV).local`
3. `.env.local`（`NODE_ENV=test` 时不加载）
4. `.env.$(NODE_ENV)`
5. `.env`

## 端口

@See https://nextjscn.org/docs/app/api-reference/cli/next

默认端口是 `3000`，可以通过 `-p` / `--port` 指定端口：

```shell
next dev -p 6969
```

也可以指定主机名：

```shell
next dev -p 6969 -H 0.0.0.0
```

生产启动同理：

```shell
next start -p 6969
```

也可以使用 `PORT` 环境变量：

```shell
PORT=6969 next dev
```

注意：`PORT` 不能写在 `.env` 里，因为 HTTP 服务启动发生在应用代码初始化之前。

## 部署

@See https://nextjscn.org/docs/app/getting-started/deploying

# 指南

## 国际化 next-intl

![](./imgs/i18n-intl.gif)

### 概述

@See https://nextjs.org/docs/app/guides/internationalization

@See https://github.com/amannn/next-intl/tree/main/examples/example-app-router

[next-intl ↪](https://next-intl.dev/) 使用 **ICU Message Format** 语法，与 React 组件天然兼容。 支持变量替换、复数、选择分支、HTML 片段等多场景。

### 准备

#### 目录结构

```
src
├── next.config.ts
├── app
│   ├── [locale]
│   │   ├── (home)
│   │   │   └── page.tsx
│   │   ├── [...rest]
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components
│   ├── features
│   │   ├── ClientComp.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ServerComp.tsx
│   ├── layouts
│   └── ui
├── i18n
│   ├── messages           # 通过脚本输出 —— pnpm i18n:json
│   │   ├── en-US.json
│   │   ├── es.json
│   │   ├── pt.json
│   │   └── zh-CN.json
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
└── proxy.ts
```

#### 安装依赖

```shell
$ pnpm add next-intl
$ pnpm add xlsx -D
```

#### 翻译准备

假设支持 `zh-CN` `en-US` `pt` `es`，传统模式下翻译经由专人维护一个 Excel 表，大致如下：

| key             | zh-CN                                  | en-US                                                       | pt                                                 | es                                                    |
| --------------- | -------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------- |
| title           | i18n 学习指南                          | i18n Study Guide                                            | Guia de Estudo de i18n                             | Guía de Estudio de i18n                               |
| profile.tips    | 会员已到期，请充值                     | Membership has expired, please renew.                       | A associação expirou, por favor renove.            | La membresía ha expirado, por favor renueve.          |
| profile.reward1 | 恭喜您，获得 {point} 个积分            | Congratulations! You’ve earned {point} points.              | Parabéns! Você ganhou {point} pontos.              | ¡Felicidades! Has ganado {point} puntos.              |
| profile.reward2 | 恭喜您，获得 \<tag>{point}\</tag> 积分 | Congratulations! You’ve earned \<tag>{point}\</tag> points. | Parabéns! Você ganhou \<tag>{point}\</tag> pontos. | ¡Felicidades! Has ganado \<tag>{point}\</tag> puntos. |

> 💡 翻译人员可以使用[Crowdin](https://crowdin.com/teams/engineering)等本地化管理解决方案协作处理消息。

此时，可以通过脚本工具将 Excel 转成 json，这里给大家简单分享一个可以满足基本需求的脚本。

```shell
$ tree scripts
scripts
└── excel2json
    ├── index.ts          # 执行文件
    └── translations.xlsx # 翻译源文件
```

> `index.ts`

```ts
/**
 * src/scripts/excel2json/index.ts
 * Excel → JSON 翻译导出脚本
 * 安装依赖：pnpm add -D xlsx
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === 1. 可配置变量 ===
const EXCEL_FILE_NAME = 'translations.xlsx';
const SHEET_NAME = 'Sheet1';
const ROOT = path.resolve(__dirname, '../../');
const INPUT_DIR = path.join(ROOT, '/scripts/excel2json');
const OUTPUT_DIR = path.join(ROOT, '/src/i18n/messages');

// === 2. 类型定义 ===
interface ExcelRow {
  /** 翻译 key */
  key?: string;
  /** 备注（可选） */
  remark?: string;
  /** 语言列 */
  [lang: string]: string | undefined;
}

type NestedObject = {
  [key: string]: string | NestedObject;
};

// === 3. 读取 Excel 文件 ===
const excelPath = path.join(INPUT_DIR, EXCEL_FILE_NAME);
console.log(`📂 读取 Excel 文件: ${excelPath}`);

const workbook = XLSX.readFile(excelPath);
const sheet = SHEET_NAME ? workbook.Sheets[SHEET_NAME] : workbook.Sheets[workbook.SheetNames[0]];

if (!sheet) throw new Error(`❌ 找不到 Excel sheet: ${SHEET_NAME}`);
console.log(`📄 使用 Sheet: ${SHEET_NAME || workbook.SheetNames[0]}`);

const rawData: ExcelRow[] = XLSX.utils.sheet_to_json(sheet);
console.log(`🔑 Excel 共读取 ${rawData.length} 条记录`);

// === 4. 获取语言列 ===
const header: string[] = Object.keys(rawData[0] || {}).filter(
  (key) => key !== 'key' && key !== 'remark',
);
console.log(`🌐 发现语言列: ${header.join(', ')}`);

// === 5. 递归写入对象属性 ===
function setNested(obj: NestedObject, keyPath: string, value: string) {
  const keys = keyPath.split('.');
  let current: NestedObject = obj;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      current[k] = value;
    } else {
      current[k] = (current[k] as NestedObject) || {};
      current = current[k] as NestedObject;
    }
  });
}

// === 6. 初始化结果对象和计数器 ===
const result: Record<string, NestedObject> = {};
const langCounts: Record<string, number> = {};
header.forEach((lang) => {
  result[lang] = {};
  langCounts[lang] = 0;
});

// === 7. 处理每一行数据 ===
rawData.forEach((row) => {
  const key = row.key?.toString().trim();
  if (!key) return; // 没有 key 整行跳过

  header.forEach((lang) => {
    let value = row[lang];
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      value = String(value).trim();
      setNested(result[lang], key, value);
      langCounts[lang] += 1; // 只统计有值的翻译
    }
  });
});

// === 8. 输出 JSON 文件并显示提示 ===
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`🧹 创建输出目录: ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
} else {
  console.log(`🧹 清空输出目录下文件: ${OUTPUT_DIR}`);
  const files = fs.readdirSync(OUTPUT_DIR);
  files.forEach((file) => {
    const filePath = path.join(OUTPUT_DIR, file);
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath); // 删除文件
    }
  });
}

header.forEach((lang) => {
  const filePath = path.join(OUTPUT_DIR, `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(result[lang], null, 2), 'utf8');
  console.log(`✅ [${lang}] 文件生成: ${filePath}，共 ${langCounts[lang]} 条有效翻译`);
});

console.log(`🎉 转换完成！共生成 ${header.length} 个语言文件`);
console.log(`📂 输出目录: ${OUTPUT_DIR}`);

```

添加 scripts 命令：

```json
{
  "i18n:json": "tsx scripts/excel2json/index.ts"
}
```

执行脚本命令：`pnnpm i18n:json` 即可生成对应的语言 json 文件 — `src/i18n/locales/...`

### 实现

1、在 `next.config.ts` 中集成插件

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

2、路由配置

@See https://next-intl.dev/docs/routing/configuration

> `i18n/routing.ts`

```ts
/**
 * i18n 路由配置
 * @see https://next-intl.dev/docs/routing/configuration
 */

import { defineRouting } from "next-intl/routing";

// -- 定义支持的语言环境和默认语言环境
export const locales = ["zh-CN", "en-US", "pt", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "zh-CN";

export const routing = defineRouting({
  // 支持的语言（如果要依赖于后端接口，或动态获取，需要在中间件中处理）
  locales,
  // 默认语言
  defaultLocale,
  // 语言前缀
  localePrefix: 'as-needed',
  // 禁用自动语言检测，当没有语言前缀时始终使用默认语言
  localeDetection: false,
});
```

3、设置代理

@See https://next-intl.dev/docs/routing/middleware

```ts
// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  return intlMiddleware(request);
}
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

```

4、设置导航 API

@See https://next-intl.dev/docs/routing/navigation

> `i18n/navigation.ts`

```ts
import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
```

5、请求配置

> `i18n/request.ts`

```ts
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

6、语言路由布局，把所有现有的布局和页面移到 `[locale]` 部分中：

```tsx
// src/app/layout.tsx
// Since we have a root `not-found.tsx` page, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```


```tsx
// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '@/app/globals.css';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/class-helpers';
import { geistMono } from '@/lib/fonts';

export const runtime = 'edge';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={cn('antialiased', geistMono.variable)}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

```

```tsx
// src/app/[locale]/[...rest]/page.tsx
import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  notFound();
}
```

```tsx
// src/app/page.tsx
import { redirect } from 'next/navigation';

import { routing } from '@/i18n/routing';

export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
```

7、使用翻译

```tsx
// src/app/[locale]/(home)/page.tsx
import ClientComp from '@/components/features/ClientComp';
import LanguageSwitcher from '@/components/features/LanguageSwitcher';
import ServerComp from '@/components/features/ServerComp';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <LanguageSwitcher />
      <div className="flex items-start gap-4">
        <ClientComp />
        <ServerComp />
      </div>
    </div>
  );
}

```

```tsx
// src/components/features/ClientComp.tsx
'use client';
import { useTranslations } from 'next-intl';

export default function ClientComp() {
  const t = useTranslations();
  const point = 6000;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div>客户端组件</div>
      <div>{process.env.NEXT_PUBLIC_API_BASE_URL}</div>
      <div className="w-full space-y-2 bg-gray-200 p-4 text-black">
        {/* 1. 没有变量 */}
        <div>{t('title')}</div>
        <div>{t('profile.tips')}</div>

        {/* 2. 存在变量（插值） */}
        <div>{t('profile.reward1', { point })}</div>

        {/* 3. 自定义渲染 */}
        <div>
          {t.rich('profile.reward2', {
            tag: (children) => <span className="font-bold text-red-500">{children}</span>,
            point,
          })}
        </div>
      </div>
    </div>
  );
}

```

```tsx
// src/components/features/ServerComp.tsx
import { getTranslations } from 'next-intl/server';

export default async function ServerComp() {
  const t = await getTranslations();
  const point = 6000;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div>服务端组件</div>
      <div>{process.env.NEXT_PUBLIC_API_BASE_URL}</div>
      <div className="w-full space-y-2 bg-gray-200 p-4 text-black">
        {/* 1. 没有变量 */}
        <div>{t('title')}</div>
        <div>{t('profile.tips')}</div>

        {/* 2. 存在变量（插值） */}
        <div>{t('profile.reward1', { point })}</div>

        {/* 3. 自定义渲染 */}
        <div>
          {t.rich('profile.reward2', {
            tag: (children) => <span className="font-bold text-red-500">{children}</span>,
            point,
          })}
        </div>
      </div>
    </div>
  );
}

```

8、切换语言

```tsx
// src/components/features/LanguageSwitcher.tsx
'use client';

import { useState } from 'react';

import { useLocale } from 'next-intl';

import { usePathname, useRouter } from '@/i18n/navigation';
import { clsx } from '@/lib/class-helpers';

/**
 * LanguageSwitcher 组件
 *
 * 功能：
 * - 显示可用语言列表，每个按钮带国旗
 * - 当前选中语言高亮
 * - 点击按钮切换语言，使用 router.replace 替换当前 URL，不增加历史记录
 *
 * 数据依赖：
 * - routing.locales: 项目支持的语言列表
 * - routing.defaultLocale: 默认语言
 *
 * 用法：
 * <LanguageSwitcher />
 *
 * 备注：
 * - 使用了 clsx 工具函数来处理 Tailwind 类名动态拼接
 */

// 语言列表直接包含国旗
const langs = [
  { code: 'zh-CN', label: '🇨🇳 Chinese' },
  { code: 'en-US', label: '🇺🇸 English' },
  { code: 'pt', label: '🇧🇷 Português' },
  { code: 'es', label: '🇪🇸 Español' },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const [loading, setLoading] = useState(false);

  const onSwitchLocale = (locale: string) => {
    if (loading) return;
    if (locale === currentLocale) return;
    setLoading(true);
    router.replace(pathname, { locale });
  };

  return (
    <div className="flex items-center gap-2">
      {langs.map((locale) => {
        const isActive = locale.code === currentLocale;
        return (
          <button
            key={locale.code}
            type="button"
            onClick={() => onSwitchLocale(locale.code)}
            className={clsx(
              'cursor-pointer rounded border px-3 py-1.5 text-sm transition-colors',
              isActive
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100',
            )}
          >
            {locale.label}
          </button>
        );
      })}
    </div>
  );
}

```

### 扩展

1. 关于多语言下处理 404 和 Error 的坑，请参考 [这里 ↪](https://github.com/amannn/next-intl/discussions/329)

2. VS Code 插件扩展：[i18n Ally ↪](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)，配置如下：

   ```json
   // i18n-ally 配置
   "i18n-ally.sourceLanguage": "en",
   "i18n-ally.displayLanguage": "zh-CN",
   "i18n-ally.localesPaths": ["src/i18n/messages"],
   "i18n-ally.pathMatcher": "{locale}.json",
   "i18n-ally.enabledFrameworks": ["next-intl", "general"],
   "i18n-ally.keystyle": "nested"
   ```

## PWA

@See https://nextjs.org/docs/app/guides/progressive-web-apps

PWA（Progressive Web App，渐进式网页应用）可以让网站具备接近 App 的体验，例如：添加到桌面、离线访问、后台缓存、推送通知等。

对于博客项目，PWA 最实用的能力通常是：

- 可以安装到桌面或手机主屏幕。
- 断网时显示一个友好的离线页面。
- 缓存部分静态资源，提升二次访问体验。

先记住一句话：**manifest 负责“看起来像 App”，Service Worker 负责“离线和缓存”。**

### 创建 Web 应用程序清单

Next.js 使用 App Router 内置支持创建 [Web 应用程序清单 ↪](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps/Manifest)。

> `app/manifest.ts`

```ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leo Blog",
    short_name: "Blog",
    description: "A blog built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

常用字段说明：

| 字段 | 作用 |
| --- | --- |
| `name` | 应用完整名称 |
| `short_name` | 桌面图标下显示的短名称 |
| `start_url` | 打开 PWA 时进入的页面 |
| `display` | `standalone` 表示像独立 App 一样打开 |
| `theme_color` | 浏览器 UI 主题色 |
| `icons` | 安装到桌面时使用的图标 |

> **提示**：可以通过 [网站图标生成器 ↪](https://realfavicongenerator.net/) 生成不同尺寸的图标。

### 创建 Service Worker

Service Worker 放在 `public/sw.js`，浏览器会通过 `/sw.js` 访问它。

下面是一个适合博客项目的简化版本：只处理离线兜底，不做复杂缓存策略。

```ts
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("blog-cache-v1").then((cache) => {
      return cache.addAll(["/offline"]);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match("/offline");
    })
  );
});
```

这段代码的意思是：

- 安装时缓存 `/offline` 页面。
- 页面导航请求正常走网络。
- 如果断网或请求失败，就展示离线页。

### 创建离线页面

> `app/offline/page.tsx`

```tsx
export default function OfflinePage() {
  return (
    <main>
      <h1>当前处于离线状态</h1>
      <p>请检查网络连接后再刷新页面。</p>
    </main>
  );
}
```

### 注册 Service Worker

Service Worker 需要在浏览器中注册，因此要写成客户端组件。

> `app/pwa-register.tsx`

```tsx
"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
```

在 `app/layout.tsx` 中引入：

```tsx
import { PWARegister } from "./pwa-register";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
```

### 推送通知

官方文档也介绍了 Web Push。博客项目一般可以先不做，除非有这些需求：

- 新文章发布后提醒订阅用户。
- 评论回复后提醒用户。
- 站点需要类似 App 的通知能力。

推送通知需要用户授权、Push Subscription、服务端保存订阅信息，并由服务端发送通知，复杂度比普通 PWA 安装和离线缓存高很多。

### 测试 PWA

💡 **Tip**：要测试 PWA 是否生效：

1. 运行生产环境。

   ```shell
   pnpm build
   pnpm start
   ```

2. 浏览器访问站点。

3. 打开 **DevTools → Application → Manifest**，检查名称、图标、主题色。

4. 打开 **DevTools → Application → Service Workers**，检查 `/sw.js` 是否注册成功。

5. 切换到离线模式，刷新页面，确认是否显示 `/offline` 页面。

6. 使用 Lighthouse 检查 PWA 基础项。

注意：PWA 通常要求 HTTPS，`localhost` 开发环境除外。

# 扩展

## 生成密钥

```shell
openssl rand -base64 32
```

## 使用Swiper轮播组件

@See https://www.swiperjs.net/

> 提示：在 nextjs 中使用 Swiper，唯一需要注意的就是一定要添加 `use client`  作为客户端组件使用。
