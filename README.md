# 概述

[React >>](https://zh-hans.react.dev/) 是 Facebook 在2013年推出的一个用于构建 Web 和原生交互界面的库。

> 注意：本系列文章是基于 React 19 + tailwindscss + Next.js 的一个学习指南，开始之前，建议您先了解  [Next.js](https://nextjs.org/)  和 [tailwindscss](https://tailwindcss.com/) 的一些基础用法，若您想获取 React 总览，请点击 [这里 >>](https://zh-hans.react.dev/reference/react)。

2024 年 12 月 05 日，React 19 稳定版本正式发布，欲知详情，请参考 [这里 >>](https://zh-hans.react.dev/blog/2024/12/05/react-19)

# 构建项目

@See https://zh-hans.react.dev/learn/start-a-new-react-project

推荐使用 [Next.js](https://nextjs.org/) 或者 [Vite](https://cn.vitejs.dev/) 构建项目。

## Vite

**[Vite](https://cn.vitejs.dev/)** 是一种新型的现代前端构建工具，旨在通过原生 ES 模块支持提供极快的冷启动速度和高效的开发体验。

```shell
$ pnpm create vite <project-name> --template react-ts
```

> **提示**：参考 [搭建第一个 Vite 项目 >>](<https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project>)

## Next.js

**[Next.js](https://nextjs.org/)** 是一个基于 React 的全栈框架，专为构建高性能、可扩展的 Web 应用而设计，支持服务器端渲染（SSR）、静态站点生成（SSG）和 API 路由等功能，简化了 React 应用的开发流程

```shell
$ npx create-next-app@latest
```

> **提示**：参考 [Automatic installation >>](https://nextjs.org/docs/app/getting-started/installation#automatic-installation)

# 课前准备

综合考虑，使用 Vite.js 构建项目

## 1️⃣ **创建项目**

在终端输入以下命令：

```shell
$ pnpm create vite react-tutorials --template react-ts && cd react-tutorials && pnpm install && code .
```

> **提示**：上面的指令会创建一个项目，同时安装依赖并在 vscode 中打开项目。

## 2️⃣ **目录结构**

```
react-tutorials
.
├── node_modules/     # 存放项目依赖包，由包管理器自动生成和管理
├── public/           # 存放静态资源，打包时直接拷贝到根目录
├── src/              # 项目源码目录        
│   ├── App.tsx       # 根组件       
│   ├── index.css     # 全局样式
│   ├── main.tsx      # 入口文件          
│	  └──	vite-env.d.ts # Vite 环境变量类型声明       
├── .gitignore        # 指定 Git 忽略的文件和目录          
├── eslint.config.js  # ESLint 配置文件，用于代码规范检查           
├── index.html        # 应用入口 HTML 文件      
├── package.json      # 项目元数据和依赖信息           
├── pnpm-lock.yaml    # pnpm 的依赖锁定文件
├── tsconfig.app.json # TypeScript 配置文件，分别用于应用、全局和 Node.js 环境的配置
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.js    # Vite 构建工具配置文件      
```

> **提示**：参照上述目录结构，删除 **`/src`** 目录下的其他文件即可。

## 3️⃣ **配置项目 - 取别名 alias**

```shell
$ pnpm add -D @types/node
```

> **`vite.config.ts`**

```ts
import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig } from 'vite'
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react'

// https://cn.vitejs.dev/config/
export default defineConfig((_config: ConfigEnv): UserConfig => {

  // -- 获取当前工作目录路径
  const root = process.cwd();
  const pathResolve = (path: string) => resolve(root, '.', path);

  return {
    resolve: {
      alias: {
        "@": pathResolve('src'),
      },
    },
    plugins: [react()],
  };
});
```

> **`tsconfig.app.json`**

```tsx
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
  },
}
```

## 4️⃣ **配置 tailwindscss**

1. 安装 Tailwind CSS

   ```shell
   $ pnpm add tailwindcss @tailwindcss/vite
   ```

2. 配置 Vite 插件：在 vite.config.ts 配置文件中添加 @tailwindcss/vite 插件

   ```ts
   import { defineConfig } from 'vite'
   import tailwindcss from '@tailwindcss/vite'
   export default defineConfig({
     plugins: [
       ...
       tailwindcss(),
     ],
   })
   ```

3. 导入 Tailwind CSS：在 **`index.css`** 中导入 Tailwind CSS 的内容

```css
@import "tailwindcss";
```

## 5️⃣ 修改文件

> `@/main.tsx`

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import './index.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

```

> `@/App.tsx`

```tsx
export default function App() {
  return <div>Hello, React.js!</div>;
}
```

## 6️⃣ 启动项目

```shell
$ pnpm dev
```

> **提示**：打开浏览器，访问 http://localhost:5173/  查看页面效果，输出：*Hello,React.js*

# 结语

本指南并非详尽的教程，而是我在学习 React.js 过程中的笔记整理。在各个章节中，除非有特别需要说明的地方，我通常会直接提供官方文档的链接。

我希望它能作为你学习 React.js 的一个大纲，帮助你快速了解核心概念，并结合官方文档进行深入学习。
