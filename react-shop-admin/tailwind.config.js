const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/pages/**/*.{html,js,jsx}',
    './src/pages/components/**/*.{html,js,jsx}',
    './src/styles/*.{css,scss}',
  ],
  theme: {
    colors: {
      ...colors,
    },
  },
};
