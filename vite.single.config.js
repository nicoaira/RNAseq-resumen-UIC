import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single self-contained HTML file for offline use (projector, no internet):
// npm run build:single  ->  dist-single/index.html
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  build: {
    outDir: 'dist-single',
    emptyOutDir: true,
  },
})
