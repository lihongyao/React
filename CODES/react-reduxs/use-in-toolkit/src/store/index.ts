import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { loadState, saveState } from '@/store/persistor';
import userReducer from '@/store/slices/userSlice';
import counterReducer from '@/store/slices/counterSlice';

// 👉 自动调用 combineReducers 合并 reducers
const store = configureStore({
  reducer: {
    user: userReducer,
    counter: counterReducer,
  },
  preloadedState: loadState(), // 使用 localStorage 里的数据初始化 store
});

// 👉 监听 store 变化，持久化到 localStorage
store.subscribe(() => {
  saveState(store.getState());
});


// 👉 TypeScript：从 store 本身推断出 RootState 和 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


// 👉 定义 Chunk 类型
/**
 * AppThunk 类型定义
 * @template ReturnType - Thunk 函数的返回值类型，默认为 void
 * @param ReturnType - 返回值类型
 * @returns ThunkAction
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown, // 如果没有额外的参数，可以保持为 unknown
  UnknownAction // 如果有特定的 action 类型，可以替换为更具体的类型
>;

export default store;
