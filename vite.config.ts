import react from '@vitejs/plugin-react-swc'

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';


const PORT = 3000;

// eslint-disable-next-line import/no-default-export
export default defineConfig((env) => {
  process.env = { ...process.env, ...loadEnv(env.mode, process.cwd()) };
  return {
    logLevel: 'warn',
    server: {
      port: PORT,
      open: `http://localhost:${PORT}`,
    },
    preview: {
      port: PORT,
      open: `http://localhost:${PORT}`,
    },
    build: {
      outDir: './build',
      sourcemap: true,
      // Disable auto-inline assets
      assetsInlineLimit: 0,
      rollupOptions: {
        // These are large unused optional external dependencies from jspdf
        // Don't include them in the built bundle
        // https://github.com/parallax/jsPDF#optional-dependencies
        external: ['html2canvas', 'canvg'],
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/setupTests.ts'],
      exclude: [
        '**/src/e2e/**',
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [path.resolve(__dirname, './src')],
        },
      },
    },
    esbuild: {
      // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    plugins: [
      env.mode === 'development' &&
        checker({
          overlay: {
            initialIsOpen: process.env.VITE_DEV_SERVER_OVERLAY === 'true',
          },
          eslint: {
            lintCommand: 'eslint "./src/**/*.{ts,tsx}" -c .eslintrc.js',
          },
          typescript: true,
        }),
      svgr(),
      vanillaExtractPlugin(),
      tsconfigPaths(),
      react({}),
    ],
  };
});
