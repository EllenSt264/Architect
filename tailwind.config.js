module.exports = {
  purge: {
    enabled: true,
    content: ["./frontend/src/**/*.js", "./frontend/src/**/*.jsx"],
    options: {
      whitelist: [],
    },
  },
  darkMode: "class",
  variants: {
    extend: {},
  },
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        roboto: ['"Roboto"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
