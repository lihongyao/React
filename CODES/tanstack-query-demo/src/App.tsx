import clsx from "clsx";
import { useState } from "react";
import All from "./components/All";
import Product from "./components/Product";
import Page from "./components/Page";

const tabs = [
  { label: "全部", value: "all" },
  { label: "单个产品", value: "product" },
  { label: "分页", value: "page" },
];
export default function App() {
  const [k, setK] = useState("all");
  return (
    <div className="pt-12">
      {/* 顶部 */}
      <header className="fixed top-0 left-0 w-full h-12 bg-gray-200 flex items-center">
        {/* 添加 Tab 切换 */}
        <div className="container mx-auto">
          <div className=" flex gap-4 0 ">
            {tabs.map((tab) => (
              <div
                className={clsx("cursor-pointer", {
                  "text-blue-500 font-bold": k === tab.value,
                })}
                key={tab.value}
                onClick={() => setK(tab.value)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </header>
      {/* 内容 */}
      <div className="container mx-auto my-4">
        {k === "all" && <All />}
        {k === "product" && <Product />}
        {k === "page" && <Page />}
      </div>
    </div>
  );
}
