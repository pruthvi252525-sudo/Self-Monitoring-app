/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#101626',
          800: '#161f36',
          750: '#1e2945',
          700: '#263353',
        },
        priority: {
          p1: '#ef4444', // Red-500
          p2: '#f59e0b', // Amber-500
          p3: '#3b82f6', // Blue-500
          p4: '#64748b', // Slate-500
        },
        category: {
          academic: '#8b5cf6', // Violet-500
          dev: '#10b981',      // Emerald-500
          personal: '#ec4899', // Pink-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};

