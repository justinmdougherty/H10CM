import { useContext, useEffect } from 'react';
import { CustomizerContext } from 'src/context/CustomizerContext';
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { Toaster } from './services/notificationService';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { initializeSearchSystem } from './services/searchInitializer';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);

  // Initialize search system on app startup
  useEffect(() => {
    initializeSearchSystem();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <RTL direction={activeDir}>
          <CssBaseline />
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: '',
              duration: 4000,
              style: {
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                maxWidth: '400px',
                boxShadow: theme.shadows[4],
              },
              success: {
                duration: 4000,
                style: {
                  background: theme.palette.success.main,
                  color: theme.palette.success.contrastText,
                },
              },
              error: {
                duration: 6000,
                style: {
                  background: theme.palette.error.main,
                  color: theme.palette.error.contrastText,
                },
              },
            }}
          />
        </RTL>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
