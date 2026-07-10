# 概述

本文旨在记录基于 Next.js 搭建项目的过程。

相关环境：

```
- Node.js：v25.1.0
- pnpm：v10.28.1
- Next.js：v16 + App Router
```

# 创建项目

@See https://nextjs.org/docs/app/getting-started/installation

```shell
$ pnpm create next-app@latest nextjs-template [--yes]
✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? … No / 【Yes】
✔ Which linter would you like to use? › None
✔ Would you like to use React Compiler? … No / 【Yes】
✔ Would you like to use Tailwind CSS? … No / 【Yes】
✔ Would you like your code inside a `src/` directory? … No / 【Yes】
✔ Would you like to use App Router? (recommended) … No / 【Yes】
✔ Would you like to use Turbopack? (recommended) … No / 【Yes】
✔ Would you like to customize the import alias (`@/*` by default)? … No / 【Yes】
✔ What import alias would you like configured? … @/*
```

> **提示**：
>
> - `--yes` 会跳过提示，使用已保存的偏好或默认设置。
> - 校验工具选择 `None`，后续会单独配置 `oxlint` + `prettier`。

# 目录结构

@See https://nextjs.org/docs/app/getting-started/project-structure

```
$ tree -I 'node_modules' -L 3
.
├── .prettierrc
├── commitlint.config.js
├── env/
├── env.d.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public                     # 静态文件，如图片、字体、图标等
│   ├── fonts
│   ├── images
│   ├── styles
│   │   ├── overrides
│   │   ├── skins
│   │   └── themes
│   └── sw.js
├── README.md
├── scripts
│   ├── build-styles
│   ├── convert-css-vars
│   └── excel2json
├── src
│   ├── api
│   │   ├── apiConfig
│   │   └── apiServer
│   ├── app                    # 使用 App Router 的页面结构 (Next.js 13+)
│   │   ├── [lang]
│   │   │   ├── (app)          # 需要主题布局的路由组
│   │   │   │   ├── (home)     # 首页
│   │   │   │   └── others...  # 其他页面
│   │   │   ├── (modals)       # 路由弹框
│   │   │   ├── (standalone)   # 无需主题布局的路由组
│   │   │   │   └── xxx
│   │   │   └── not-found.tsx  # 多语言路由组 404
│   │   ├── favicon.ico
│   │   ├── layout.tsx         # 应用根布局
│   │   ├── page.tsx
│   │   └── not-found.tsx      # 全局404
│   ├── components             # 组件
│   │   ├── features           # 业务组件
│   │   ├── layout             # 布局组件
│   │   └── ui                 # 基础组件
│   ├── configs                # 品牌/项目配置项（非必须，可使用环境变量）
│   │   └── brands
│   ├── constants              # 常量定义
│   ├── hooks                  # 自定义钩子
│   ├── i18n                   # 国际化i18n next-intl
│   │   ├── locales
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── libs                   # 工具函数
│   │   ├── brand.ts
│   │   └── class-helpers.ts
│   ├── providers
│   │   └── brand.provider.tsx # 全局 Provider（如 Context API 或 Redux Provider）
│   ├── proxy.ts
│   ├── stores
│   │   └── globalStore.ts
│   └── types
└── tsconfig.json
```

# 开发规范

## 代码规范检查与修复

选择 [oxlint ↪](https://oxc-project.github.io/)

oxlint 是一个用 Rust 编写的极速 JavaScript/TypeScript linter，性能优异，适合大型项目。

1、安装依赖

```shell
$ pnpm add -D oxlint
```

2、在 package.json 文件中加入如下快捷指令

```json
{
  "scripts": {
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix ."
  }
}
```

3、统一风格，项目内配置 `.vscode` 目录

```shell
$ mkdir -p .vscode && touch .vscode/{extensions,settings}.json
```

> `settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "prettier.requireConfig": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

> `extensions.json`

```json
{
  "recommendations": ["esbenp.prettier-vscode"]
}
```

## 代码格式化

选择 [Prettier ↪](https://prettier.io/) + [prettier-plugin-tailwindcss ↪](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

使用 Prettier 配合 `prettier-plugin-tailwindcss` 实现 Tailwind 类名自动排序，使用 `@trivago/prettier-plugin-sort-imports` 实现导入排序。保存文件时会自动删除未使用的 import、排序导入和类名、格式化代码。

1、安装依赖

```shell
$ pnpm add -D prettier prettier-plugin-tailwindcss @trivago/prettier-plugin-sort-imports
```

2、根目录新建 `.prettierrc` 文件

```json
{
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^react$",
    "^next",
    "<THIRD_PARTY_MODULES>",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

3、在 package.json 中添加格式化脚本

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

4、配置 VS Code / Cursor

安装 [Prettier - Code formatter ↪](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 扩展，编辑器设置已在上方【代码规范检查与修复】章节第3步配置完成。

> **提示**：
>
> - `plugins` 数组中，`prettier-plugin-tailwindcss` 必须放在最后，以确保 Tailwind 类名排序正确
> - `importOrder` 配置导入排序规则：React → Next.js → 第三方库 → 项目内部（@/） → 相对路径
> - `importOrderSeparation` 为 `true` 时，不同组之间会插入空行
> - `importOrderSortSpecifiers` 为 `true` 时，同一导入语句中的多个导入会按字母顺序排序
> - 删除未使用的 import 功能由 TypeScript/JavaScript 语言服务提供，无需额外配置

## Commit 规范检查

推荐：Conventional Commits + Husky + lint-staged + Commitlint

这套组合可以在提交前自动检查代码规范、校验 commit 信息格式，并提供交互式的提交体验。

1、安装依赖

```shell
$ pnpm add -D husky lint-staged @commitlint/{config-conventional,cli}
```

2、在 `package.json` 中配置 `lint-staged`

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["oxlint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

当你执行 git commit 时，lint-staged 会自动：

- 运行 `oxlint --fix` 修复代码规范问题
- 运行 `prettier --write` 格式化代码（包括 Tailwind 类名排序和导入排序）

确保提交的代码风格统一、格式正确。

3、初始化 husky

```shell
$ pnpm husky init
```

这会自动创建 .husky/ 目录和一个默认的 pre-commit 钩子。

4、配置 pre-commit 钩子，编辑 .husky/pre-commit 文件：

```bash
# 在提交前执行代码格式化与检查
pnpm lint-staged
```

提交前会自动运行 lint-staged，确保提交的代码风格、语法正确。

5、配置 commit-msg 钩子，创建 .husky/commit-msg 文件：

```bash
pnpm commitlint --edit "$1"
```

这个钩子会在每次提交时校验你的提交信息是否符合 Conventional Commits 规范。

6、创建 commitlint 配置，在项目根目录新建 `commitlint.config.js`：

```js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // ✨ 新功能
        "fix", // 🐛 修复 bug
        "docs", // 📝 文档更新
        "style", // 💅 代码格式（不影响逻辑）
        "refactor", // ♻️ 重构（非新增功能、非修复）
        "perf", // ⚡️ 性能优化
        "test", // ✅ 测试相关修改
        "build", // 🏗️ 构建系统或依赖更新
        "ci", // 🤖 CI/CD 配置变更
        "chore", // 🔧 杂项任务
        "revert", // ⏪ 回滚提交
      ],
    ],
    "subject-case": [0],
  },
};
```

现在，当你执行 git commit 时，Husky 会自动触发以下两个钩子：

| **阶段** | **钩子名** | **执行内容**                | **目的**                   |
| -------- | ---------- | --------------------------- | -------------------------- |
| 提交前   | pre-commit | pnpm lint-staged            | 检查暂存区代码是否符合规范 |
| 提交时   | commit-msg | pnpm commitlint --edit "$1" | 校验提交信息格式           |

👉 这样，你的项目会在提交时自动检查代码质量和提交信息规范，确保仓库记录干净、统一、可读。

7、引导式提交（推荐）

为了让团队成员更方便地书写规范化的 commit message，我们可以使用 **Commitizen** 提供交互式提交体验：

```shell
$ pnpm add -D commitizen cz-conventional-changelog
```

在 package.json 中添加配置：

```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  },
  "scripts": {
    "commit": "cz"
  }
}
```

然后执行命令：

```shell
$ pnpm commit
```

系统会弹出一个交互式命令行界面，引导你选择提交类型、填写变更说明。

# 环境变量

多品牌、多环境项目通过统一的环境变量管理，简化开发与部署流程。

## 文件结构

```shell
$ mkdir -p env && touch env/.env.{afun,bfun}.{dev,stage,prod} env.d.ts
$ tree env -a
env
├── .env.afun.dev
├── .env.afun.prod
├── .env.afun.stage

├── .env.bfun.dev
├── .env.bfun.prod
└── .env.bfun.stage
```

命名规则：`.env.{brand}.{env}`（如 `.env.afun.dev`）

## 类型声明

项目根目录创建 `env.d.ts`：

```ts
// -- 客户端环境变量
type ClientEnv = {
  NEXT_PUBLIC_ENV: 'dev' | 'stage' | 'prod';
  NEXT_PUBLIC_BRAND: string;
  NEXT_PUBLIC_API_HOST_S: string;
  NEXT_PUBLIC_API_HOST_C: string;
};

// -- 服务端环境变量
type ServerEnv = {
  ACCESS_TOKEN: string;
  [__key__: string]: unknown;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ClientEnv, ServerEnv {}
  }
}

export {};
```

> 提示：`NEXT_PUBLIC_` 前缀的变量会暴露到浏览器端。

## 配置与使用

1. **安装依赖**

```shell
$ pnpm add -D cross-env dotenv dotenv-cli tsx
```

2. **脚本配置（推荐参数化）**

```json
{
  "scripts": {
     "predev": "cross-env app=${app:-afun} env=${env:-dev} dotenv -e env/.env.${app-afun}.${env-dev} -- tsx scripts/pre-setup/index.ts",
		 "dev": "dotenv -e env/.env.${app-afun}.${env-dev} -- next dev --turbopack",

		 "prebuild": "cross-env app=${app:-afun} env=${env:-dev} dotenv -e env/.env.${app-afun}.${env-dev} -- tsx scripts/pre-setup/index.ts",
		 "build": "dotenv -e env/.env.${app-afun}.${env-dev} -- next build --turbopack",
  }
}
```

> 提示：`pre-setup/index.ts` 可以让你在构建时处理一些事务。

3. **使用方式**

```shell
# 开发 👉 默认 afun, dev
$ pnpm dev

# 指定品牌/环境
$ app=afun pnpm dev
$ app=afun env=stage pnpm build
```

4. **访问变量**

```tsx
// 客户端 & 服务端
process.env.NEXT_PUBLIC_API_BASE_URL;

// 仅服务端
process.env.ACCESS_TOKEN;
```

# 样式

@See https://nextjs.org/docs/app/getting-started/css

## Tailwind CSS

选择： [tailwindcss ↪](https://tailwindcss.com/)

创建项目时，已 ☑️ 启用tailwindcss

tailwindcss 工具，新建 `@/libs/class-helpers.ts`

```shell
$ pnpm add class-variance-authority tailwind-merge
```

```ts
/**
 * TailwindCSS ClassName 工具函数
 *
 * 用途：
 * - cn: 拼接类名并自动合并 Tailwind 冲突类，适合组件中使用。
 * - clsx: 条件拼接类名，不合并冲突，适合快速临时类名拼接。
 *
 * 使用：
 * import { cn, clsx } from "@/lib/class-helpers";
 *
 * 安装依赖：
 * pnpm add class-variance-authority tailwind-merge
 *
 * 参考：
 * - https://github.com/joe-bell/cva
 * - https://github.com/dcastil/tailwind-merge
 */

import { type CxOptions, cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/** 拼接类名并自动合并 Tailwind 冲突类 */
export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}

/** 条件拼接类名，不处理冲突 */
export function clsx(...inputs: CxOptions) {
  return cx(inputs);
}
```

## 类名排序

Tailwind CSS 类名排序已通过 `prettier-plugin-tailwindcss` 插件自动处理，无需额外配置。保存文件时，Prettier 会自动按照 Tailwind 推荐的顺序对类名进行排序。

> **提示**：`prettier-plugin-tailwindcss` 必须作为 Prettier 配置中的最后一个插件，以确保正确排序。

# 获取数据

@See https://nextjs.org/docs/app/getting-started/fetching-data

# 状态管理

1、安装依赖

```shell
$ pnpm add zustand immer
```

2、定义 store

```ts
// src/stores/globalStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type GlobalStateProps = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const useGlobalStore = create<GlobalStateProps>()(
  immer((set) => ({
    count: 0,
    increment: () =>
      set((state) => {
        state.count += 1;
      }),
    decrement: () =>
      set((state) => {
        state.count -= 1;
      }),
  })),
);
```

3、使用示例

```tsx
// src/app/[lang]/_components/Counter.tsx
"use client";
import { useGlobalStore } from "@/stores/globalStore";

export default function Counter() {
  const { count, increment, decrement } = useGlobalStore((state) => state);
  return (
    <div>
      <div>计数器：{count}</div>
      <button type="button" onClick={increment}>
        +1
      </button>
      <button type="button" onClick={decrement}>
        -1
      </button>
    </div>
  );
}
```

# 多主题多皮肤

参考阅读：

# 集成 shadcn-ui

参考 [这里 ↪](https://ui.shadcn.com/docs/installation/next/)

> 💣 **注意**：初始化时会在 @/lib/utils.ts 创建工具函数文件。如果本地已有同名文件，建议提前重命名（如 helpers.ts），以免被覆盖。

## 初始化项目配置

执行：

```shell
$ pnpm dlx shadcn@latest init
```

主要操作：

1. 检测项目环境 ✅
2. 生成 Base Color 配置 ✅
3. 创建 components.json ✅
4. 更新 globals.css 的 CSS 变量 ✅
5. 安装依赖 ✅
6. 创建基础工具函数文件 utils.ts ✅

> 💡 提示：想更改组件生成路径，可在 components.json 的 aliases 中修改。

## 安装组件

例如安装 [Dialog ↪](https://ui.shadcn.com/docs/components/dialog)：

```shell
$ pnpm dlx shadcn@latest add dialog
```

默认会生成：

```
src/components/ui/dialog.tsx
```

你可以根据项目习惯重命名或调整结构：

```
src/components/ui/Dialog.tsx
```

或

```
src/components/ui/Dialog/index.tsx
```

> 建议：为了统一导入路径，可在 index.tsx 中做一次 re-export，例如：

```ts
export { Dialog } from "./DialogComponentFile";
```

# 日志记录

@see https://github.com/winstonjs/winston?tab=readme-ov-file#quick-start

1️⃣ 安装依赖

```shell
$ pnpm add winston
```

2️⃣ 创建日志目录

```shell
$ mkdir logs
```

> 注意：生产环境 Node 进程需要对这个目录有写权限。

3️⃣ 创建 logger 单例

```ts
// libs/logger.server.ts
// @see https://github.com/winstonjs/winston?tab=readme-ov-file#quick-start

import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "node:path";

// 日志目录
const logDir = path.join(process.cwd(), "logs");

// 日志配置
const logger = createLogger({
  // 日志级别
  level: "info",
  // 日志格式
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`),
  ),
  // 日志输出
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(logDir, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});

export default logger;
```

- DailyRotateFile 实现日志轮转，避免单文件过大。
- Console 可以在开发环境直接看到日志。
- 日志文件会在 logs/ 下生成，每天一个文件，保留 14 天。

# Code Inspector

[Code Inspector ↪](https://inspector.fe-dev.cn/) 是一款提升开发效率的工具，点击页面上的 DOM，它能够自动打开你的 IDE 并将光标定位到 DOM 对应的源代码位置。

1）安装

```shell
$ pnpm add code-inspector-plugin -D
```

2）配置

```ts
// next.config.js
import type { NextConfig } from 'next';
import { codeInspectorPlugin } from 'code-inspector-plugin';

const nextConfig: NextConfig = {
  turbopack: {
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
    }),
  },
};

export default nextConfig;
```

3）使用

- macOS：<kbd>Options</kbd> + <kbd>Shift</kbd> + 鼠标点击指定 DOM  元素
- windows：<kbd>Alt</kbd> + <kbd>Shift</kbd> + 鼠标点击指定 DOM  元素
