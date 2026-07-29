import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';
import { ThemeContextProvider, useThemeContext } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './theme';

const ThemedApp: React.FC = () => {
  const { mode } = useThemeContext();
  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  </React.StrictMode>
);
