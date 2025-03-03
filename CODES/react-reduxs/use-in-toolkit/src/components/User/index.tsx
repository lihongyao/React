import { nanoid } from "@reduxjs/toolkit";
import { CSSProperties, memo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserById, selectInfos, selectLoading } from "@/store/slices/userSlice";

export default memo(function User() {
  // -- styles
  const styles: CSSProperties = {
    textAlign: "center",
  };
  // -- stores
  const infos = useAppSelector(selectInfos);
  const loading = useAppSelector(selectLoading);
  // -- dispatch
  const dispatch = useAppDispatch();
  // -- renders
  return (
    <div style={styles}>
      <p>{loading ? "Loading..." : `${infos.name} - ${infos.job}`}</p>
      {/* 这里 “fetchUserById” 的参数被自动推断为 string */}
      {/* 生成随机的ID字符串：nanoid()  */}
      <button onClick={() => dispatch(fetchUserById(nanoid()))}>Fetch Infos</button>
    </div>
  );
});
