import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 👉 推荐在整个应用程序中使用，而不是单纯的使用 useDispatch & useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>(); 