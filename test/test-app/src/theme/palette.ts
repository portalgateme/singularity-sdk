import { PaletteOptions } from '@mui/material'

interface OtherColorTypes {
  divider: string
  border: {
    main: string
    secondary: string
  }
  table: {
    caption: string
    hover: string
  }
  dialog: {
    background: string
  }
  primary: {
    p200: string
    p50: string
  }
  neutral: {
    n950: string
    n900: string
    n200: string
    n500: string
    n700: string
    n50: string
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    other: OtherColorTypes
  }
  interface PaletteOptions {
    other: OtherColorTypes
  }
}

const palette: PaletteOptions | undefined = {
  primary: {
    main: '#77ED91',
    dark: '#D6D6D6',
    light: '#C9F8D3',
  },
  secondary: {
    main: '#17181C',
    light: '#8D8D8D',
  },
  warning: {
    main: '#FF8061',
    dark: '#D14121',
    light: 'rgba(255, 128, 97, 0.15)',
  },
  info: {
    main: '#FFF',
    dark: '#D14121',
    light: '#E8EFEC',
  },
  text: {
    primary: '#000000',
    secondary: '#728F81',
  },
  other: {
    divider: '#272C33',
    border: {
      main: '#1F750E',
      secondary: '#B8B8B8',
    },
    table: {
      caption: '#374548',
      hover: '#F5F5F5',
    },
    dialog: {
      background: 'rgba(245, 245, 245, 0.7)',
    },
    primary: {
      p200: '#347F44',
      p50: '#1D5A2B',
    },
    neutral: {
      n950: '#FFFFFF',
      n900: '#F4F5F7',
      n200: '#576E63',
      n500: '#A4C0B2',
      n700: '#D1DFD9',
      n50: '#2F3C35',
    },
  },
  action: {
    disabledBackground: '#E8EFEC',
  },
}

export default palette
