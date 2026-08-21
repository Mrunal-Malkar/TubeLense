import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json' with { type: 'json' }


import path from 'path'
import fs from 'fs/promises'
import type { Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function copyTransformersAssetsPlugin(): Plugin {
  return {
    name: 'copy-transformers-assets',
    apply: 'build',
    async closeBundle() {
      const root = process.cwd()
      const srcDir = path.resolve(root, 'toBeInDest/dist')
      const destDir = path.resolve(root, 'dist/wasm')
      await fs.mkdir(destDir, { recursive: true })
      const files = [
        'ort-wasm-simd-threaded.jsep.mjs',
        'ort-wasm-simd-threaded.jsep.wasm',
        'ort-wasm-simd-threaded.asyncify.mjs',
        'ort-wasm-simd-threaded.asyncify.wasm',
        'ort.wasm.mjs',
        'ort.wasm.min.mjs',
      ]
      for (const f of files) {
        const src = path.join(srcDir, f)
        const dest = path.join(destDir, f)
        try {
          await fs.copyFile(src, dest)
        } catch (err) {
          console.warn(`Could not copy ${f}:`, err)
        }
      }
    },
  }
}


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest }),copyTransformersAssetsPlugin(),tailwindcss()],
  build: {
    modulePreload:false,
    rollupOptions: {
      input: {
        background: "src/background/background.ts",
        offscreen:"src/background/offscreen.html"
      },
    }
  }
})
