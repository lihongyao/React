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
    <div className="p-4">
      {/* 添加 Tab 切换 */}
      <div className="flex gap-4">
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
      {/* 内容 */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
        {k === "all" && <All />}
        {k === "product" && <Product />}
        {k === "page" && <Page />}
      </div>
    </div>
  );
}
