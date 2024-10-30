import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#18181b', // primary
        darkest: '#111827', // headings
        dark: '#4b5563', // secondary texts
        medium: '#a1a1aa', // non-decorative
        light: '#e4e4e7', // decorative
        background: '#f3f4f6',
      },
    },
  },
  plugins: [],
};
export default config;
