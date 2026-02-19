import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    minify: "esbuild",
    reportCompressedSize: true,
    rollupOptions: {
      input: {
        baseline: "src/baseline.tsx",
        core: "src/core.tsx",
        react: "src/react.tsx",
      },
    },
  },
});
