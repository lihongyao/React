import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "@/App.tsx";
import store from "@/store";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 使用Provider，加载数据仓库 store 即可在全局范围内使用 store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
