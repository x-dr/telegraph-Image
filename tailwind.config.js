/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      }, height: {
        "1/12": "8.3333333%",
        "11/12": "91.66666%",
        "1/10": "10%",
        "3/20": "15%",
        "4/5": "80%",
        "5/12": "41.666666%",
        "7/12": "58.33333%",
        "1/24": "4.16666666%",
        "7/8": "87.5%",
        "100": "100%"


      },
      width: {
        "9/10": "90%",
        "11/12": "91.66666%",
        "4/5": "80%",
        "160": "40rem",
        "144": "36rem",
        '128': '32rem',
      },
      zIndex: {
        '10': '10',
        '20': '20',
        '25': '25',
        '30': '30',
        '40': '40',
        '50': '50',
      },
    },
  },
  plugins: [],
};
