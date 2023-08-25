import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'riple-dark-blue': '#0883C6',
      },
    }
  },
  plugins: [],
} satisfies Config;
