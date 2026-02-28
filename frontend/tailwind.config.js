/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cinna: {
          sky: '#87CEEB',
          'sky-light': '#B8E0F7',
          'sky-pale': '#D4ECFA',
          cream: '#FFF8F0',
          'cream-warm': '#FFFDE7',
          lavender: '#C8B4E3',
          'lavender-light': '#E8D5F5',
          pink: '#FFB6C1',
          'pink-light': '#FFD6DC',
          cloud: '#F0F8FF',
          text: '#4A4A6A',
          'text-soft': '#8080A4',
          'border': 'rgba(135, 206, 235, 0.35)',
          ocean:    '#4ECDC4',
          coral:    '#FF6B8A',
          hibiscus: '#E8365D',
          star:     '#FFE566',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 4px 20px rgba(135, 206, 235, 0.22)',
        'soft-lg': '0 8px 40px rgba(135, 206, 235, 0.30)',
        card: '0 4px 16px rgba(135, 206, 235, 0.18), 0 1px 4px rgba(0,0,0,0.04)',
        glow: '0 0 24px rgba(200, 180, 227, 0.45)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        'float-slow': 'float 11s ease-in-out infinite',
        'float-slower': 'float 15s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.65s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'cloud-drift': 'cloudDrift 22s ease-in-out infinite alternate',
        'cloud-drift-r': 'cloudDriftR 28s ease-in-out infinite alternate',
        'petal-fall': 'petalFall 8s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        sparkle: 'sparkle 1.8s ease-in-out infinite',
        'float-rotate': 'floatRotate 9s ease-in-out infinite',
        sway: 'sway 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        cloudDrift: {
          '0%': { transform: 'translateX(-25px)' },
          '100%': { transform: 'translateX(25px)' },
        },
        cloudDriftR: {
          '0%': { transform: 'translateX(20px)' },
          '100%': { transform: 'translateX(-20px)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.3) rotate(20deg)', opacity: '0.7' },
        },
        floatRotate: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(15deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
      },
    },
  },
  plugins: [],
};
