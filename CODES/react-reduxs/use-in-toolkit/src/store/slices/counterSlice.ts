import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk, RootState } from '@/store';

// 👉 定义 CounterState 类型
export type CounterState = {
  count: number;
};

// 👉 定义常量
const DELAY_TIME = 1000; // 异步操作的延迟时间

// 👉 initialState
const initialState: CounterState = { count: 0 };

// 👉 Chunks
// → 异步更新Store，你也可以通过 createAsyncThunk 函数创建
export const incrementAsync = (amount: number): AppThunk => {
  return async (dispatch) => {
    try {
      console.log('Loading...');
      await new Promise((resolve) => setTimeout(resolve, DELAY_TIME)); // 模拟异步操作
      dispatch(incrementByAmount(amount)); // 分发同步 action
      console.log('Completed!');
    } catch (error) {
      console.error('Async operation failed:', error);
    }
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