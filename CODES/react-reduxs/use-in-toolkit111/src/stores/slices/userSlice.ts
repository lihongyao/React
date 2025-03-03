import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/stores';

// 👉 Define some types.
type UserInfos = { name: string; job: string };
type UserState = { loading: boolean; infos: UserInfos };

// 👉 initialState
const initialState: UserState = {
  infos: { name: '', job: '' },
  loading: false,
};

// 👉 Chunks - 异步逻辑
// → 根据ID请求用户信息
export const fetchUserById = createAsyncThunk<
  // → 定义返回值类型
  UserInfos,
  // → 定义参数类型
  string,
  // → 定义 Thunk-Apis 类型，比如 dispatch & getState 返回值类型
  { dispatch: AppDispatch; state: RootState }
>('user/fetchUserById', async (userId, thunkApi) => {
  const { dispatch, getState, requestId, signal, extra } = thunkApi;
  console.log(getState());
  console.log(`USER ID is: ${userId}`);
  // → 模拟请求
  const response = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: '张三', job: '程序猿' });
    }, 1000);
  });
  // → 推断返回值类型
  return response as UserInfos;
});

// 👉 Define Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // -- 自动生成Action：{ type: 'user/updateInfos', payload: UserInfos }
    updateInfos: (state, action: PayloadAction<UserInfos>) => {
      state.infos = action.payload;
    },
  },
  // → 处理异步 thunk dispatch 的每个 action
  extraReducers(builder) {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.infos = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      });
  },
});

// 👉 Selectors
export const selectInfos = (state: RootState) => state.user.infos;
export const selectLoading = (state: RootState) => state.user.loading;

// 👉 Export Dispatchs
export const { updateInfos } = userSlice.actions;

// 👉 Export Reducer
export default userSlice.reducer;
