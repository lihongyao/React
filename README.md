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

> **提示**：如果你是 Next.js 的新手，请查看 [Next.js](https://nextjs.org/)。

# 课前准备

为了快速掌握 React 的基础语法，并避免繁琐的环境配置，我们使用 **Next.js** 进行构建。

1️⃣ **创建项目**

在终端输入以下命令：

```shell
$ npx create-next-app@latest
```

> **提示**：填写项目名称后，直接回车（↩︎）即可完成创建。

2️⃣ **在 VSCode 中打开项目**

使用以下命令：

```shell
$ code react-tutorials
```

> **提示**：\<react-tutorials> 是创建项目时定义的 **项目名称**，请根据实际情况替换。

3️⃣ **替换 `app/page.tsx` 内容**

```tsx
import React from "react";

export default function Page() {
  return <div>Hello, React.js!</div>;
}
```

4️⃣ **启动项目**

```shell
$ npm run dev
```

> **提示**：打开浏览器，访问 http://localhost:3000/ 查看页面效果。

# 结语

本指南并非详尽的教程，而是我在学习 React.js 过程中的笔记整理。在各个章节中，除非有特别需要说明的地方，我通常会直接提供官方文档的链接。

我希望它能作为你学习 React.js 的一个大纲，帮助你快速了解核心概念，并结合官方文档进行深入学习。
