import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: ["14px", "22px"],
        base: ["16px", "24px"],
        lg: ["18px", "24px"],
        xl: ["20px", "24px"],
      },
      colors: {
        text: "black",
        primary: "#2858B9",
        secondary: "#ffffff",
        gray: {
          100: "#EFF2F4",
          200: "#7B7881",
          300: "#524F5A",
          400: "#B8B7BB",
          500: "#E1E0E2",
          600: "#BBB7BB",
        },
        "primary-foreground": "#ffffff",
        "secondary-foreground": "#2858B9",
        border: "#E7E3FA",
        white: "#FFFFFF",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "10rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
        },
      },
      boxShadow: {
        "brand-shadow": "0px 10px 60px 0px #CCC",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;