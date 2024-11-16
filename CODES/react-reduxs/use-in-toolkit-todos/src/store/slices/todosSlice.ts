/*
 * @Author: Lee
 * @Date: 2023-02-11 17:16:06
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-13 22:27:23
 * @Description:
 */
import { fetch, save } from '@/service';
import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface TodoState {
  id: number /** 待办事项id */;
  text: string /** 待办事项内容 */;
  completed: boolean /** 待办事项状态 */;
  color?: string /** 待办事项颜色标记 */;
}



const initialState: Array<TodoState> = [];
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * 👉 服务器请求待办事项列表
     * @param state
     * @param action {type: 'todos/todosLoaded', payload: Array<TodoState> → todos}
     * @returns
     */
    todosLoaded(_, action: PayloadAction<Array<TodoState>>) {
      return action.payload;
    },
    /**
     * 👉 添加一个新的待办事项
     * @param state
     * @param action {type: 'todos/todoAdded', payload: TodoState → todo}
     */
    todoAdded(state, action: PayloadAction<TodoState>) {
      state.push(action.payload);
    },
    /**
     * 👉 切换待办事项的完成状态
     * @param state
     * @param action {type: 'todos/todoToggled', payload: number → todoId}
     */
    todoToggled(state, action: PayloadAction<number>) {
      const todo = state.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    /**
     * 👉 为待办事项选择颜色类别
     * @param state
     * @param action {type: 'todos/colorSelected, payload: { todoId: number; color: string }}
     */
    colorSelected(
      state,
      action: PayloadAction<{ todoId: number; color: string }>
    ) {
      const { color, todoId } = action.payload;
      const todo = state.find((todo) => todo.id === todoId);
      if (todo) {
        todo.color = color;
      }
    },
    /**
     * 👉 删除待办事项
     * @param state
     * @param action {type: 'todos/todoDeleted', payload: number → todoId}
     */
    todoDeleted(state, action: PayloadAction<number>) {
      const index = state.findIndex((todo) => todo.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    /**
     * 👉 将所有待办事项标记为已完成
     * @param state
     * @param action {type: 'todos/todoDeleted'}
     */
    allCompleted(state) {
      state.forEach((todo) => {
        todo.completed = true;
      });
    },
    /**
     * 👉 清除所有已完成的待办事项
     * @param state
     * @param action {type: 'todos/completedCleared'}
     * @returns
     */
    completedCleared: () => {
      return [];
    },
  },
});

// -- 导出Actions
export default todosSlice.reducer;
// -- 导出Reducers
export const todoActions = todosSlice.actions;

/**
 * 「Thunk」 函数 - 异步请求待办事项列表
 * @param dispatch
 */
export async function fetchTodos(dispatch: Dispatch) {
  console.log('loading...');
  const response = await fetch();
  dispatch(todoActions.todosLoaded(response));
}
/**
 * 「Thunk」 函数 - 异步存储待办事项
 * @param dispatch
 */
export function saveNewTodo(text: string) {
  return async function saveNewTodoThunk(dispatch: Dispatch) {
    const todo = await save(text);
    dispatch(todoActions.todoAdded(todo));
  };
}
