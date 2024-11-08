import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: "@src", replacement: resolve(__dirname, "src") },
      {
        find: "@components",
        replacement: resolve(__dirname, "src/components"),
      },
      {
        find: "@layout",
        replacement: resolve(__dirname, "src/components/layout"),
      },
      {
        find: "@modal",
        replacement: resolve(__dirname, "src/components/modal"),
      },
      {
        find: "@pages",
        replacement: resolve(__dirname, "src/pages"),
      },
      {
        find: "@utils",
        replacement: resolve(__dirname, "src/utils"),
      },
      {
        find: "@api",
        replacement: resolve(__dirname, "src/utils/api"),
      },
      {
        find: "@hook",
        replacement: resolve(__dirname, "src/utils/hook"),
      },
    ],
  },

  plugins: [react(), tsconfigPaths()],
});
