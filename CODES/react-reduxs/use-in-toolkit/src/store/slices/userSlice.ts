import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from '@/store';

// 👉 Define a type for the slice state
type UserInfos = { name: string; job: string };
type UserState = { loading: boolean; infos: UserInfos };

// 👉 Define the initial state using that type
const initialState: UserState = {
  infos: { name: '', job: '' },
  loading: false,
};


// 👉 Define the thunks
export const fetchUserById = createAsyncThunk<
  // → 定义返回值类型
  UserInfos,
  // → 定义参数类型
  string,
  // → 定义 Thunk-Apis 类型，比如 dispatch & getState 返回值类型
  { dispatch: AppDispatch; state: RootState }
>(
  'users/fetchByIdStatus',
  async (userId, thunkAPI) => {
    const { dispatch, getState, requestId, signal, extra } = thunkAPI;
    void requestId;
    void signal;
    void extra;
    void dispatch;
    console.log(getState());
    console.log(`USER ID is: ${userId}`);
    // -- 模拟请求
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = {
      data: {
        name: '张三',
        job: '前端工程师'
      }
    }
    return response.data
  },
)

// 👉 Define Slice
export const userSlice = createSlice({
  name: 'users',
  // -- userSlice 将从 initialState 参数推断状态类型
  initialState,
  reducers: {
    setInfos: (state, action: PayloadAction<UserInfos>) => {
      state.infos = action.payload;
    }
  },
  // → 处理异步 thunk dispatch 的每个 action
  extraReducers(builder) {
    builder
      .addCase(fetchUserById.pending, state => {
        state.loading = true
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.infos = action.payload
      }).addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      })
  },
});

// 👉 Export actions
export const { setInfos } = userSlice.actions;
// 👉 Export Selectors
export const selectInfos = (state: RootState) => state.user.infos;
export const selectLoading = (state: RootState) => state.user.loading;
// 👉 Export Reducer
export default userSlice.reducer;

