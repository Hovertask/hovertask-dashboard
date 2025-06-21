import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,tsx,js,ts}", "./index.html", "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4b70f5",
        success: "#009a49",
        danger: "#ff5449",
        secondary: "#000000BF"
      },
      screens: {
        mobile: "821px"
      }
    }
  },
  darkmode: false,
  plugins: [heroui()]
};
