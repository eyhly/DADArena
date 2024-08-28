import { createTheme } from '@mui/material/styles';

const ColorTheme = createTheme({
  palette: {
    primary: {
      main: '#FFD500',
    },
    secondary: {
      main: '#fff176',
    },
    text: {
      primary: '#0f0f0f',
    },
  },
  typography: {
    fontFamily: 'Rubik, sans serif',
  },
});

export default ColorTheme;
