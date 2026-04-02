import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: "#C6A75E",
          charcoal: "#1A1A1A",
          ivory: "#F7F5F2",
          forest: "#1F3D2B",
          slate: "#0f172a"
        }
      }
    }
  },
  plugins: []
};

export default config;
