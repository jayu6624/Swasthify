import { useState, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Box, CssBaseline, ThemeProvider, createTheme, alpha } from '@mui/material'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Nutrition from './pages/Nutrition'
import Activities from './pages/Activities'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import AiChat from './pages/AiChat'
import SnapMeal from './pages/SnapMeal'

// Create context for theme mode
import { createContext } from 'react';
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Main theme green color
const mainGreen = '#15803D'; // Darker shade of green
const secondaryGreen = '#166534'; // Even darker for gradients

function App() {
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth >= 1200);
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  // Simplify the theme to reduce potential rendering issues
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mainGreen,
            light: alpha(mainGreen, 0.6),
            dark: secondaryGreen,
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#111827',
            light: '#4B5563',
            contrastText: '#FFFFFF',
          },
          background: {
            default: mode === 'light' ? '#F9FAFB' : '#111827',
            paper: mode === 'light' ? '#FFFFFF' : '#1F2937',
            subtle: mode === 'light' ? alpha(mainGreen, 0.05) : alpha(mainGreen, 0.1),
          },
          text: {
            primary: mode === 'light' ? '#111827' : '#F9FAFB',
            secondary: mode === 'light' ? '#4B5563' : '#9CA3AF',
          },
          divider: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        shape: {
          borderRadius: 12,
        },
        // Reduce complex component overrides that might cause rendering issues
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar open={drawerOpen} handleDrawerToggle={toggleDrawer} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 0,
              width: { sm: `calc(100% - ${drawerOpen ? '260px' : '80px'})` },
              ml: { sm: 0 },
              overflow: 'auto',
              transition: 'all 0.2s ease-in-out',
              pt: { xs: '64px', md: 0 },
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard colorMode={colorMode} />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/ai-chat" element={<AiChat />} />
              <Route path="/snap-meal" element={<SnapMeal />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App 