import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material';

// Define our available themes with a primary color and a gradient
export const APP_THEMES = {
  indigo: {
    primary: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    secondary: '#a855f7'
  },
  emerald: {
    primary: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
    secondary: '#3b82f6'
  },
  rose: {
    primary: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    secondary: '#e11d48'
  },
  amber: {
    primary: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
    secondary: '#ea580c'
  },
};

type ThemeKey = keyof typeof APP_THEMES;

interface ThemeContextType {
  currentTheme: ThemeKey;
  setTheme: (key: ThemeKey) => void;
  gradient: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    return (localStorage.getItem('app-theme') as ThemeKey) || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', currentTheme);
  }, [currentTheme]);

  // Create the actual MUI theme based on selection
  const muiTheme = createTheme({
    palette: {
      primary: { main: APP_THEMES[currentTheme].primary },
      background: { default: '#f8fafc' },
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: 'none', fontWeight: 600 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' }, // Remove default elevation overlay
        }
      }
    }
  });

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme: setCurrentTheme,
      gradient: APP_THEMES[currentTheme].gradient
    }}>
      <MUIThemeProvider theme={muiTheme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};