const { nextui } = require('@nextui-org/theme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/pages/**/*.{html,js,jsx}",
    "./src/components/**/*.{html,js,jsx}",
    "./src/layout/**/*.{html,js,jsx}",
    "./src/public/*.{ico,svg}",
    "./src/common/*.{js,jsx}",
    "./src/styles/*.{css,scss}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|table|checkbox|spacer).js"
  ],
  theme: {
    colors: {
      ...colors,
    },
  },
  plugins: [require("@tailwindcss/forms"), nextui()],
};

