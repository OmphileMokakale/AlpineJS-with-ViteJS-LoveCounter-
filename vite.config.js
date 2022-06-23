import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix' 

export default defineConfig({
    base: '/AlpineJS-with-ViteJS-LoveCounter-/',
    plugins: [
        mix({
          handler: './api.js',
        }),
      ],
})
