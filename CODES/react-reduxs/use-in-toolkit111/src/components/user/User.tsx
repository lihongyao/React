/*
 * @Author: Lee
 * @Date: 2023-02-17 14:53:25
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-17 18:06:00
 * @Description:
 */
import { nanoid } from '@reduxjs/toolkit';
import React, { CSSProperties, memo } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  fetchUserById,
  selectInfos,
  selectLoading,
} from '@/stores/slices/userSlice';

const User: React.FC = () => {
  // -- styles
  const styles: CSSProperties = {
    textAlign: 'center',
  };
  // -- stores
  const infos = useAppSelector(selectInfos);
  const loading = useAppSelector(selectLoading);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- renders
  return (
    <div style={styles}>
      <p>{loading ? 'Loading...' : `${infos.name} - ${infos.job}`}</p>
      {/* 这里 “fetchUserById” 的参数被自动推断为 string */}
      {/* 生成随机的ID字符串：nanoid()  */}
      <button onClick={() => dispatch(fetchUserById(nanoid()))}>
        Fetch Infos
      </button>
    </div>
  );
};

export default memo(User);
