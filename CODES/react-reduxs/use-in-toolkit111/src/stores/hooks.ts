/*
 * @Author: Lee
 * @Date: 2023-02-17 13:57:59
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-17 18:01:49
 * @Description:
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/stores';

// 👉 推荐在整个应用程序中使用，而不是单纯的使用 useDispatch & useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
