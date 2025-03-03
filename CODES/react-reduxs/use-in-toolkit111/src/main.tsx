import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// → React-Redux 利用上下文 Context，提供的数据组件 Provider
import { Provider } from 'react-redux';
import store from './stores';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 使用Provider，加载数据仓库 store 即可在全局范围内使用 store */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);