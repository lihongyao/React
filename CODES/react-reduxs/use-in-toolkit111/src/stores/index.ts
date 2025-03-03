/*
 * @Author: Lee
 * @Date: 2023-02-17 13:57:55
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-17 18:02:39
 * @Description:
 */
import { AnyAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import couterReducer from '@/stores/slices/couterSlice';
import userReducer from '@/stores/slices/userSlice';

// 👉 自动调用 combineReducers 合并 reducers
const store = configureStore({
  reducer: {
    counter: couterReducer,
    user: userReducer,
  },
});

// 👉 TypeScript：从 store 本身推断出 RootState 和 AppDispatch 类型
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// 👉 定义Chunk类型
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

export default store;
