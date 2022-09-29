const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/pages/**/*.{html,js,jsx}',
    './src/components/**/*.{html,js,jsx}',
    './src/layout/**/*.{html,js,jsx}',
    './src/public/*.{ico,svg}',
    './src/common/*.{js,jsx}',
    './src/styles/*.{css,scss}',
  ],
  theme: {
    colors: {
      ...colors,
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

