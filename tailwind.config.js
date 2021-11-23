const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: true,
    content: ["./**/*.liquid", "./src/*.css"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    screens: {
      xs: "480px",
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
      margin: ["first", "last"],
      inset: ["hover"],
      transform: ["group-hover"],
      scale: ["group-hover"],
      opacity: ["group-hover"],
    },
  },
  plugins: [],
};
