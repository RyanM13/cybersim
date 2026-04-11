/**
 * Configuration File for Vite
 * 
 * Responsible for Tailwind & React integration, and path aliasing.
 */

import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// ChatGPT: __dirname is giving me undefined how do I fix this.
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],  // activates React and Tailwind CSS
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // shortcut using "@/" rather than "src/", 
    },
  },
});
