import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        frost: {
          500: "rgba(255, 255, 255, 0.1)", // Vidro
          900: "#020617", // Fundo profundo
        },
        ice: {
          100: "#dbeafe",
          400: "#60a5fa", // Azul gelo
          glow: "#0ea5e9",
        },
        danger: "#ef4444", // Live ON
      },
      backgroundImage: {
        'mountain-gradient': 'linear-gradient(to bottom, #0f172a, #020617)',
      },
      animation: {
        'snow': 'fall linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;