/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        112: '28rem',
        128: '32rem',
      },
      colors: {
        'eerie-black': '#212121',
        'black-1000': '#343541',
        jet: '#343541',
        'gray-alpha': 'rgba(0,0,0, .64)',
        'gray-1000': '#F6F6F6',
        'gray-2000': 'rgba(0, 0, 0, 0.5)',
        'gray-3000': 'rgba(243, 243, 243, 1)',
        'gray-4000': '#949494',
        'gray-5000': '#BBBBBB',
        'gray-6000': '#757575',
        'red-1000': 'rgb(254, 202, 202)',
        'red-2000': '#F44336',
        'red-3000': '#621B16',
        'blue-1000': '#7D54D1',
        'blue-2000': '#002B49',
        'blue-3000': '#4B02E2',
        'purple-30': '#7D54D1',
        'purple-3000': 'rgb(230,222,247)',
        'blue-4000': 'rgba(0, 125, 255, 0.36)',
        'blue-5000': 'rgba(0, 125, 255)',
        'green-2000': '#0FFF50',
        'light-gray': '#edeef0',
        'white-3000': '#E0E0E0',
        'just-black':"#00000",
        'purple-taupe':'#464152',
        'dove-gray': '#6c6c6c',
        'silver': '#c4c4c4',
        'rainy-gray': '#a4a4a4',
        'raisin-black':'#26272E',
        'chinese-black':'#161616',
        'chinese-silver':'#CDCDCD',
        'dark-charcoal':'#3D3D40',
        'bright-gray':'#ECECF1',
        'outer-space':'#444654',
        'gun-metal':'#2E303E',
        'sonic-silver':'#747474',
        'soap':'#D8CCF1',
        'independence':'#54546D',
        'philippine-yellow':'#FFC700',
        'bright-gray':'#EBEBEB',
        'input-border': '#6A6A6A'
      },
    },
  },
  plugins: [],
};
