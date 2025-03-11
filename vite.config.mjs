import path from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint2';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default () => {
  const SRC_PATH = 'src';

  return defineConfig({
    root: path.resolve(__dirname, SRC_PATH),
    resolve: {
      alias: [
        {
          find: '@src',
          replacement: path.resolve(__dirname, SRC_PATH)
        }
      ],
      extensions: ['.ts', '.vue']
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    plugins: [
      // generate html
      createHtmlPlugin(),
      // lint
      eslintPlugin({
        fix: true
      })
    ],
    publicDir: path.resolve(__dirname, `${SRC_PATH}/assets`),
    // productioin build
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'vendor.[hash].js',
          entryFileNames: '[name].[hash].js'
        }
      },
      outDir: path.resolve(__dirname, './doc')
    },
    // local server
    server: {
      host: '0.0.0.0',
      port: 8888
    }
  });
};
