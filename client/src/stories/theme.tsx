import {createTheme} from '@mui/material/styles'

export const color = {
  main: {
    1: '#A0EBE0',
    2: '#55BCAD',
    3: '#45988C',
  },
  black: {
    1: '#1D1C1D',
    2: '#616061',
    3: '#101010',
  },
  white: {
    1: '#FFFFFF',
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: color.main[2],
      contrastText: color.white[1],
    },
    secondary: {
      main: color.main[2],
    }
  },
})