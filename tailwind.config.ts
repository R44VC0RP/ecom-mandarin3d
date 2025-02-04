/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { withUt } from "uploadthing/tw";

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: '0.2' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0.2' }
        },
        'technical-ripple': {
          '0%': { transform: 'scale(0.5)', opacity: '1', borderWidth: '4px' },
          '50%': { opacity: '0.5', borderWidth: '2px' },
          '100%': { transform: 'scale(1.2)', opacity: '0', borderWidth: '1px' }
        },
        'bounce-scale': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.85)' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'scan': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(100%)' },
          '50.1%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-slow-reverse': 'spin 3s linear infinite reverse',
        'technical-ripple-1': 'technical-ripple 1.5s ease-out forwards',
        'technical-ripple-2': 'technical-ripple 1.5s ease-out 0.2s forwards',
        'technical-ripple-3': 'technical-ripple 1.5s ease-out 0.4s forwards',
        'bounce-scale': 'bounce-scale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scan': 'scan 2s ease-in-out infinite',
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    require("tailwindcss-animate"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ]
};

export default withUt(config);


// import type { Config } from 'tailwindcss';
// import plugin from 'tailwindcss/plugin';

// const config: Config = {
//   content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['var(--font-geist-sans)']
//       },
//       keyframes: {
//         fadeIn: {
//           from: { opacity: '0' },
//           to: { opacity: '1' }
//         },
//         marquee: {
//           '0%': { transform: 'translateX(0%)' },
//           '100%': { transform: 'translateX(-100%)' }
//         },
//         blink: {
//           '0%': { opacity: '0.2' },
//           '20%': { opacity: '1' },
//           '100%': { opacity: '0.2' }
//         }
//       },
//       animation: {
//         fadeIn: 'fadeIn .3s ease-in-out',
//         carousel: 'marquee 60s linear infinite',
//         blink: 'blink 1.4s both infinite'
//       }
//     }
//   },
//   future: {
//     hoverOnlyWhenSupported: true
//   },
//   plugins: [
//     require('@tailwindcss/container-queries'),
//     require('@tailwindcss/typography'),
//     plugin(({ matchUtilities, theme }) => {
//       matchUtilities(
//         {
//           'animation-delay': (value) => {
//             return {
//               'animation-delay': value
//             };
//           }
//         },
//         {
//           values: theme('transitionDelay')
//         }
//       );
//     })
//   ]
// };

// export default config;