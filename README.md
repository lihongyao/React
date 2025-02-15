# 概述

[React >>](https://zh-hans.react.dev/) 是 Facebook 在2013年推出的一个用于构建 Web 和原生交互界面的库。

> 注意：本系列文章是基于 React 19 + tailwindscss + Next.js 的一个学习指南，开始之前，建议您先了解  [Next.js](https://nextjs.org/)  和 [tailwindscss](https://tailwindcss.com/) 的一些基础用法，若您想获取 React 总览，请点击 [这里 >>](https://zh-hans.react.dev/reference/react)。

2024 年 12 月 05 日，React 19 稳定版本正式发布，欲知详情，请参考 [这里 >>](https://zh-hans.react.dev/blog/2024/12/05/react-19)

# 构建项目

@See https://zh-hans.react.dev/learn/start-a-new-react-project

推荐使用 [Next.js](https://nextjs.org/) 或者 [Vite](https://cn.vitejs.dev/) 构建项目。

## Vite

```shell
$ pnpm create vite <project-name> --template react-ts
```

> Tips：参考 <https://cn.vitejs.dev/guide/#scaffolding-your-first-vite-project>

## Next.js

**[Next.js](https://nextjs.org/) 是一个全栈式的 React 框架**。它用途广泛，可以让你创建任意规模的 React 应用——可以是静态博客，也可以是复杂的动态应用。要创建一个新的 Next.js 项目，请在你的终端运行：

```shell
$ npx create-next-app@latest
```

如果你是 Next.js 的新手，请查看 [Next.js 教程](https://nextjs.org/learn/foundations/about-nextjs)。

# 准备

为了方便快速掌握 React 基础语法，避免配置，这里使用 Next.js 来构建。

1）构建项目：打开终端输入如下指令构建项目

```shell
$ npx create-next-app@latest
```

> 提示：填写好项目名称之后，一路回车（↩︎）即可。

2）在 VSCode 中打开项目

```shell
$ code react-basic	
```

> 提示：这里的 \<react-basic> 为我在创建项目时定义的 **项目名称**。

3）替换 `app/page.tsx` 内容

```tsx
import React from "react";

export default function Page() {
  return <div>Hello, React.js!</div>;
}
```

4）启动项目

```shell
$ npm run dev
```

> 提示：在浏览器中访问 http://localhost:3000/ 查看页面效果

# 结语

再次说明，本指南不是详细教程，而是自己在学习 React.js 中的笔记，在章节中，如果没有特别有必要说明的地方，我基本都会直接贴上官方教程的链接。

我认为，这可以作为你学习React.js 的一个大纲。

# 初体验

## 1. 安装

这里使用 vite 构建项目

```shell
$ pnpm create vite react-tutorials --template react-ts
$ cd react-tutorials && pnpm install && pnpm run dev 
```

## 2. 配置Vite

开始之前，我们简单的配置一下 `vite` 路径解析：

```shell
$ pnpm add @types/node
```

> **`vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [react()],
});
```

在 **`tsconfig.json`** 文件中的 `compilerOptions` 字段下添加如下代码。

```ts
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"]
}
```

## 3. 文件解读

> **`src/main.tsx`**

```tsx
// -- 引入相关依赖
import React from "react";
import ReactDOM from "react-dom/client";
// -- 引入根组件
import App from "@/App.tsx";

// -- 创建并渲染根节点
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> **`src/App.tsx`**

```tsx
import React from "react";

const App: React.FC = () => {
  return (
    <div className="app">
      <h3>Hello, React.js!</h3>
    </div>
  );
};

export default App;
```

> Tips：此时页面显示 → `Hello, React.js！`
