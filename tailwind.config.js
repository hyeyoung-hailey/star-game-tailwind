/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',   // Next.js app directory
    './pages/**/*.{js,ts,jsx,tsx}', // pages 디렉토리 사용 시
    './components/**/*.{js,ts,jsx,tsx}', // 컴포넌트 디렉토리 사용 시
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}