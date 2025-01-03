import { defineConfig } from "vitest/config";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    deps: {
      interopDefault: true,
    },
    server: {
      deps: {
        inline: ["ws", "alchemy-sdk"],
        fallbackCJS: true,
      },
    },
  },
});
