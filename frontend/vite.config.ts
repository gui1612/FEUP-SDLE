import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',

      base: "/",

      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },

      workbox: {
        globPatterns: ["**/*"],
        navigateFallback: "index.html",
      },
      // add this to cache all the
      // static assets in the public folder
      includeAssets: [
          "**/*",
      ],

      manifest: {
        name: 'SuperBasket',
        short_name: 'SB',
        description: 'Shopping List',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon.ico',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
