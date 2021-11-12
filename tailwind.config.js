module.exports = {
  purge: {
    enabled: true,
    content: ["./**/*.liquid", "./src/*.css"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
