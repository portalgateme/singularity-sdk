import { ThemeOptions, createTheme } from '@mui/material/styles'
import breakpoints from './breakpoints'
import typography from './typography'
import palette from './palette'
import components from './components'

const theme: ThemeOptions = createTheme({
  breakpoints,
  typography,
  palette,
  components,
})

export default theme
