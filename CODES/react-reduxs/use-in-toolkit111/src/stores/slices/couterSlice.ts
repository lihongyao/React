/*
 * @Author: Lee
 * @Date: 2023-02-17 13:58:11
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-17 18:02:05
 * @Description:
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '@/stores';

type CounterState = { count: number };

// 👉 initialState
const initialState: CounterState = { count: 0 };

// 👉 Chunks
// → 异步更新Store，你也可以通过 createAsyncThunk 函数创建
export const incrementAsync = (amount: number): AppThunk => {
  return async (dispatch, getState) => {
    await new Promise((resolve) => {
      console.log('Loading...');
      setTimeout(() => {
        resolve(null);
      }, 1000);
    });
    dispatch(incrementByAmount(amount));
    console.log('Completed!');
  };
};

// 👉 Define Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    // -- 自动生成Action：{ type: 'counter/increment' }
    increment: (state) => {
      // → Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
      // → 并不是真正的改变 state 因为它使用了 immer 库
      // → 当 immer 检测到 「draft state」 改变时，会基于这些改变去创建一个新的不可变的 state
      state.count += 1;
    },
    // -- 自动生成Action：{ type: 'counter/decrement' }
    decrement: (state) => {
      state.count -= 1;
    },
    // -- 自动生成Action：{ type: 'counter/incrementByAmount', payload: number }
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
  },
});

// 👉 Selectors
export const selectCount = (state: RootState) => state.counter.count;

// 👉 Export Dispatchs
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 👉 Export Reducer
export default counterSlice.reducer;
