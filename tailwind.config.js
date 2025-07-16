import typography from "@tailwindcss/typography";
import tailwindcssAnimate from "tailwindcss-animate";
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{html,tsx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [
    tailwindcssAnimate,
    typography,
  ],
};
