import { resolve } from "path" // Usa 'resolve' en lugar de 'path'
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // Usa 'resolve' aquí
    },
  },
})