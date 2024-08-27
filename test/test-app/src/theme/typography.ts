import { TypographyOptions } from '@mui/material/styles/createTypography'
import { lineHeight } from '@mui/system'

declare module '@mui/material/styles/createTypography' {}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'body-xs': React.CSSProperties
    'body-sm': React.CSSProperties
    'body-md': React.CSSProperties
    'body-lg': React.CSSProperties
    'button-sm': React.CSSProperties
    'button-md': React.CSSProperties
    'button-lg': React.CSSProperties
    'heading-3xl': React.CSSProperties
    'heading-2xl': React.CSSProperties
    'heading-xl': React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    'body-xs'?: React.CSSProperties
    'body-sm'?: React.CSSProperties
    'body-md'?: React.CSSProperties
    'body-lg'?: React.CSSProperties
    'button-sm'?: React.CSSProperties
    'button-md'?: React.CSSProperties
    'button-lg'?: React.CSSProperties
    'heading-3xl'?: React.CSSProperties
    'heading-2xl'?: React.CSSProperties
    'heading-xl'?: React.CSSProperties
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'body-xs': true
    'body-sm': true
    'body-md': true
    'body-lg': true
    'button-sm': true
    'button-md': true
    'button-lg': true
    'heading-3xl': true
    'heading-2xl': true
    'heading-xl': true
  }
}

const typography: TypographyOptions = {
  fontFamily: 'Poppins',

  h1: {
    fontWeight: 700,
    fontSize: '2.75rem',
    lineHeight: '115%',
    fontStyle: 'normal',
    letterSpacing: '-0.66px',
  },
  h2: {
    fontWeight: 700,
    fontSize: '2.25rem',
    lineHeight: '115%',
    fontStyle: 'normal',
    letterSpacing: '-0.54px',
  },
  h3: {
    fontWeight: 700,
    fontSize: '1.5rem',
    lineHeight: '115%',
    fontStyle: 'normal',
    letterSpacing: '-0.36px',
  },
  h4: {
    fontWeight: 700,
    fontSize: '1.25rem',
    lineHeight: '115%',
    fontStyle: 'normal',
    letterSpacing: '0.3px',
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
  },
  subtitle2: {
    fontWeight: 700,
    fontSize: '1.125rem',
    lineHeight: '150%',
    letterSpacing: '0.27px',
    fontStyle: 'normal',
  },
  body1: {
    fontSize: '1rem',
    lineHeight: '150%',
    fontWeight: 700,
    fontStyle: 'normal',
    letterSpacing: '-0.24px',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: '150%',
    fontWeight: 400,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '150%',
    fontWeight: 400,
    fontStyle: 'normal',
  },
  button: {
    fontWeight: 600,
    fontSize: '1.125rem',
    lineHeight: '133.333%',
    textTransform: 'none',
    fontStyle: 'normal',
  },

  'body-xs': {
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%' /* 18px */,
  },

  /* Body/SM/SM */
  'body-sm': {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%' /* 21px */,
  },

  /* Body/MD/MD */
  'body-md': {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%' /* 24px */,
  },

  /* Body/LG/LG Bold */
  'body-lg': {
    fontSize: '18px',
    fontStyle: 'normal',
    lineHeight: '150%' /* 27px */,
    letterSpacing: '-0.27px',
  },

  /* Functional/F7 - Button SM */
  'button-sm': {
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '16px' /* 114.286% */,
    letterSpacing: '-0.21px',
  },

  /* Functional/F6 - Button MD */
  'button-md': {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '20px' /* 125% */,
    letterSpacing: ' -0.24px',
  },

  /* Functional/F5 - Button LG */
  'button-lg': {
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '24px' /* 133.333% */,
    letterSpacing: '-0.27px',
  },

  /* Headings/2XL/2XL Desktop */
  'heading-2xl': {
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: '115%' /* 27.6px */,
    letterSpacing: '-0.36px',
  },

  /* Headings/XL/XL Desktop */
  'heading-xl': {
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '115%' /* 23px */,
    letterSpacing: '-0.3px',
  },

  /* Headings/3XL/3XL Desktop */
  'heading-3xl': {
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: ' 115%' /* 41.4px */,
    letterSpacing: ' -0.54px',
  },
}

export default typography
