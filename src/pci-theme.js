import { createTheme } from '@mui/material/styles';

const pciTheme = createTheme({
  palette: {
    primary: {
      main: '#CC2030', // PCI Red
      light: '#e65c69',
      dark: '#a5101e',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00518A', // PCI Blue
      light: '#4179b5',
      dark: '#003a62',
      contrastText: '#fff',
    },
    error: {
      main: '#CC2030', // PCI Red
    },
    warning: {
      main: '#ffac33',
    },
    info: {
      main: '#00518A', // PCI Blue
    },
    success: {
      main: '#2e7d32',
    },
    grey: {
      50: '#f5f5f5',
      100: '#eeeeee',
      200: '#e0e0e0',
      300: '#cccccc',
      400: '#b3b3b3',
      500: '#999999',
      600: '#7e7e7e',
      700: '#666666',
      800: '#4d4d4d',
      900: '#333333',
      A100: '#f9f9f9',
      A200: '#e6e6e6',
      A400: '#b8b8b8',
      A700: '#666666',
    },
    text: {
      primary: '#232323', // PCI Dark Grey
      secondary: '#555555',
      disabled: '#999999',
    },
    divider: '#e0e0e0',
    background: {
      paper: '#ffffff',
      default: '#f5f5f5',
    },
    // Custom colors
    pci: {
      red: '#CC2030',
      blue: '#00518A',
      darkGrey: '#232323',
      lightGrey: '#A8A8AA',
    },
    // Focus factory colors with PCI-coordinated palette
    focusFactory: {
      ADD: '#CC2030', // PCI Red
      BBV: '#00518A', // PCI Blue
      SYN: '#232323', // PCI Dark Grey
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.9rem',
    },
    body2: {
      fontSize: '0.8rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.07),0px 1px 3px 0px rgba(0,0,0,0.06)',
    '0px 3px 1px -2px rgba(0,0,0,0.1),0px 2px 2px 0px rgba(0,0,0,0.07),0px 1px 5px 0px rgba(0,0,0,0.06)',
    '0px 3px 3px -2px rgba(0,0,0,0.1),0px 3px 4px 0px rgba(0,0,0,0.07),0px 1px 8px 0px rgba(0,0,0,0.06)',
    '0px 2px 4px -1px rgba(0,0,0,0.1),0px 4px 5px 0px rgba(0,0,0,0.07),0px 1px 10px 0px rgba(0,0,0,0.06)',
    '0px 3px 5px -1px rgba(0,0,0,0.1),0px 5px 8px 0px rgba(0,0,0,0.07),0px 1px 14px 0px rgba(0,0,0,0.06)',
    // Continue with the rest of the shadows...
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#A8A8AA', // PCI Light Grey
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#7F7F7F',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          padding: '6px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #CC2030 0%, #b31b2a 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #00518A 0%, #004370 100%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(90deg, #CC2030 0%, #b31b2a 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#CC2030', // PCI Red
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#CC2030', // PCI Red
          height: 3,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default pciTheme;