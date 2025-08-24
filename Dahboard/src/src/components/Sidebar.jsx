import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  alpha,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  Restaurant as NutritionIcon,
  DirectionsRun as ActivitiesIcon,
  BarChart as ReportsIcon,
  Chat as ChatIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  CameraAlt as CameraIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

// Import your logo
import logo from '../assets/Swasthify.jpg'; // Make sure to add your logo file

// Drawer width constants
const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 80;

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/' },
  { text: 'Nutrition Advisor', icon: <NutritionIcon />, path: '/nutrition' },
  { text: 'Activities', icon: <ActivitiesIcon />, path: '/activities' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  // { text: 'AI Assistant', icon: <ChatIcon />, path: '/ai-chat' },
  { text: 'Snap Meal', icon: <CameraIcon />, path: '/snap-meal' },
];

function Sidebar({ open, handleDrawerToggle }) {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          background: theme.palette.mode === 'light' 
            ? `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.08)}, transparent)` 
            : `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.15)}, transparent)`,
          borderRadius: open ? 0 : '0 0 16px 0',
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={logo}
            alt="Swasthify Logo"
            sx={{
              width: open ? 40 : 35,
              height: 'auto',
              mr: open ? 2 : 0,
              transition: 'all 0.3s',
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          />
          {open && (
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              Swasthify
            </Typography>
          )}
        </Box>
        {isMobile ? (
          <IconButton 
            onClick={handleDrawerToggle} 
            edge="end" 
            sx={{ 
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton 
            onClick={handleDrawerToggle} 
            sx={{ 
              color: theme.palette.text.primary,
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        )}
      </Box>
      <Divider sx={{ mx: 2, opacity: 0.6 }} />
      
      <List sx={{ px: 2, mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.8 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  py: 1.2,
                  bgcolor: isActive 
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.15)
                    : 'transparent',
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: '60%',
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: theme.palette.primary.main,
                  } : {},
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.05 : 0.1),
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s',
                  },
                  borderRadius: 2,
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
                    transition: 'all 0.2s',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                      variant: 'body2',
                      color: 'inherit',
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {open && (
        <Box sx={{ mt: 'auto', mx: 2, mb: 2 }}>
          <Box sx={{ 
            p: 2.5, 
            borderRadius: 2,
            background: theme.palette.mode === 'light'
              ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.03)})`
              : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.05)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}>
            <DashboardIcon 
              sx={{ 
                fontSize: 40, 
                mb: 1,
                p: 1,
                borderRadius: '50%',
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }} 
            />
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              Health Dashboard Pro
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Get full access to all premium features
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 2,
                py: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              Upgrade Now
            </Button>
          </Box>
        </Box>
      )}
    </>
  );

  const mobileAppBar = isMobile && (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        display: { xs: 'block', md: 'none' },
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: theme.palette.mode === 'light'
          ? 'rgba(255,255,255,0.9)'
          : 'rgba(17,24,39,0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            component="img"
            src={logo}
            alt="Swasthify Logo"
            sx={{
              height: 35,
              width: 'auto',
              mr: 2,
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
            }}
          />
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            Swasthify
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ 
            color: theme.palette.text.primary,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );

  return (
    <>
      {mobileAppBar}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            background: theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))'
              : 'linear-gradient(180deg, rgba(17,24,39,0.95), rgba(17,24,39,0.98))',
            backdropFilter: 'blur(10px)',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            ...(isMobile && {
              width: DRAWER_WIDTH,
            }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Sidebar; 