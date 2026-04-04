import { defineConfig } from "@solidjs/start/config";
import solidSvg from "vite-plugin-solid-svg";

export default defineConfig({
  vite: {
    plugins: [solidSvg()],
    ssr: {
      noExternal: ["solid-motionone", "@motionone/dom"]
    }
  },
});
