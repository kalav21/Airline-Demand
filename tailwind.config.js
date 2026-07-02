/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef5ff",
          100: "#dbeafe",
          700: "#16456f",
          800: "#103653",
          900: "#0b2545"
        },
        teal: {
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(11, 37, 69, 0.09)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
