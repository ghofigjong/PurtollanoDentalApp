import { createTheme } from '@mui/material/styles';

// Example: Extracted from a typical blue/teal/white dental logo

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff', // now white
      light: '#f4fafd',
      dark: '#e0e0e0',
      contrastText: '#009688', // teal text on white
    },
    secondary: {
      main: '#1976d2', // blue accent
      contrastText: '#fff',
    },
    background: {
      default: '#009688', // now teal background
      paper: '#f4fafd',
    },
  },
  typography: {
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
});

export default theme;
