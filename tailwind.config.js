/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/modules/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Space Grotesk (@expo-google-fonts/space-grotesk) — tên family trùng với useFonts
      fontFamily: {
        sans: ['SpaceGrotesk_400Regular'],
      },
      colors: {
        // Cyber Safety Training palette
        primary: '#212B36',
        secondary: '#637381',
        'primary-main': '#B3F00B',
        'secondary-light': '#FF91DA',
        'secondary-main': '#EC38BC',
        'secondary-50': '#FFF7FC',

        'success-main': '#21C45D',
        neutral: '#F4F6F8',
        disabled: '#919EAB',
        'transparent-grey': '#919EAB14',
        'transparent-secondary': '#EC38BC14',
        'transparent-success': '#4CAF5014',
        'transparent-quaternary': '#5070FF14',
        'transparent-warning': '#FF980014',
        'transparent-primary': '#9075FF14',
        'transparent-error': '#F4433614',
        'input-outline': '#919EAB52',
        'component-divider': '#919EAB3D',
        /** Mockup “Tạo kế hoạch” — nút & chip chọn */
        brandLime: '#C1F800',
      },
    },
  },
  plugins: [
    // React Native: mỗi weight Space Grotesk là một fontFamily riêng — map lại cho font-normal/medium/semibold/bold
    function spaceGroteskFontPlugin({ addUtilities }) {
      addUtilities({
        '.font-normal': {
          fontFamily: 'SpaceGrotesk_400Regular',
        },
        '.font-medium': {
          fontFamily: 'SpaceGrotesk_500Medium',
        },
        '.font-semibold': {
          fontFamily: 'SpaceGrotesk_600SemiBold',
        },
        '.font-bold': {
          fontFamily: 'SpaceGrotesk_700Bold',
        },
      })
    },
  ],
}
