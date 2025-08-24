/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1A73E8',
          light: '#4791db',
          dark: '#115293',
          contrastText: '#fff',
        },
        secondary: {
          main: '#7b809a',
          light: '#9da3b7',
          dark: '#55596e',
          contrastText: '#fff',
        },
        info: {
          main: '#1A73E8',
          light: '#4791db',
          dark: '#115293',
          contrastText: '#fff',
        },
        success: {
          main: '#4CAF50',
          light: '#7bc67e',
          dark: '#3b873e',
          contrastText: '#fff',
        },
        warning: {
          main: '#fb8c00',
          light: '#ffa733',
          dark: '#c56200',
          contrastText: '#fff',
        },
        error: {
          main: '#F44335',
          light: '#f6685e',
          dark: '#aa2e25',
          contrastText: '#fff',
        },
        background: {
          default: '#f8f9fa',
          paper: '#ffffff',
          dark: '#121212',
        },
      },
      boxShadow: {
        'material-sm': '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)',
        'material-md': '0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12), 0 2px 4px -1px rgba(0,0,0,.2)',
        'material-lg': '0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12), 0 5px 5px -3px rgba(0,0,0,.2)',
        'material-xl': '0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.2)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
} 