import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "学生管理系统 | 学生管理",
  description: "学生档案与教务信息管理系统",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 text-zinc-950">
        <header className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/students" className="flex items-center gap-3" aria-label="学生管理系统首页">
              <span className="inline-flex size-9 items-center justify-center bg-emerald-700 text-white">
                <GraduationCap aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-zinc-950">学生管理系统</span>
                <span className="block text-[11px] text-zinc-500">Academic Console</span>
              </span>
            </Link>
            <nav aria-label="主导航">
              <Link href="/students" className="px-1 py-5 text-sm font-semibold text-emerald-800 cursor-pointer">
                学生档案
              </Link>
            </nav>
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
