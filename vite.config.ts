import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts(
      {
        outputDir: 'dist/types',
      }
    )
  ],
  build: {
    target: 'es2018',
    lib: {
      entry: resolve(__dirname, './index.ts'),
      name: 'ChineseNumber',
      fileName: 'index'
    }
  }
});
