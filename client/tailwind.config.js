/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Brand Colors
        brand: {
          DEFAULT: '#4F46E5', // Indigo 600
          hover: '#4338CA',   // Indigo 700
          light: '#6366F1',   // Indigo 500 (dark mode)
          'light-hover': '#818CF8', // Indigo 400 (dark mode hover)
        },
        accent: {
          DEFAULT: '#22D3EE', // Cyan 400
          glow: '#22D3EE',
        },
        // Light Mode
        light: {
          bg: {
            primary: '#FFFFFF',
            secondary: '#F8FAFC',
            card: '#FFFFFF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#64748B',
          },
          border: '#E2E8F0',
          input: {
            bg: '#FFFFFF',
            border: '#CBD5E1',
          },
        },
        // Dark Mode
        dark: {
          bg: {
            primary: '#0B1220',
            secondary: '#0F172A',
            card: '#111827',
          },
          text: {
            primary: '#E5E7EB',
            secondary: '#94A3B8',
            muted: '#64748B',
          },
          border: '#1F2937',
          input: {
            bg: '#0F172A',
            border: '#334155',
          },
        },
        // Status Colors
        success: {
          light: '#16A34A',
          dark: '#22C55E',
        },
        warning: {
          light: '#F59E0B',
          dark: '#FBBF24',
        },
        danger: {
          light: '#EF4444',
          dark: '#F87171',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(79, 70, 229, 0.4)',
        'brand-dark': '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
        'accent': '0 0 30px rgba(34, 211, 238, 0.3)',
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#4F46E5",
          "secondary": "#22D3EE",
          "accent": "#22D3EE",
          "neutral": "#0F172A",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#E2E8F0",
          "info": "#22D3EE",
          "success": "#16A34A",
          "warning": "#F59E0B",
          "error": "#EF4444",
        },
        dark: {
          "primary": "#6366F1",
          "secondary": "#22D3EE",
          "accent": "#22D3EE",
          "neutral": "#E5E7EB",
          "base-100": "#0B1220",
          "base-200": "#0F172A",
          "base-300": "#1F2937",
          "info": "#22D3EE",
          "success": "#22C55E",
          "warning": "#FBBF24",
          "error": "#F87171",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
};
