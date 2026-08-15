import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
// import { config } from "./env";

// config();

export default defineConfig(async () => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      mockReset: true,
      restoreMocks: true,
      clearMocks: true,
      include: ["./src/**/*.test.{ts,tsx}"],
      globalSetup: "./tests/vitest.setup.ts",
      setupFiles: ["./tests/vitest.setupFiles.ts"],
      environment: "jsdom",
      // https://github.com/nextauthjs/next-auth/discussions/9385
      server: {
        deps: {
          inline: ["next"],
        },
      },
    },
  };
});
