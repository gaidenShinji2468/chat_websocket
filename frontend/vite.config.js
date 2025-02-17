import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/socket.io": {
        target: "http://192.168.10.8:8000",
        ws: true,
      },
    },
  },
});
