/*
 * @Author: Lee
 * @Date: 2023-02-17 13:55:31
 * @LastEditors: Lee
 * @LastEditTime: 2023-02-17 17:31:32
 * @Description:
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
