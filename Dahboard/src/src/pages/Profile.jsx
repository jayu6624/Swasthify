import React from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  Grid,
  TextField,
  MenuItem,
  useTheme,
  alpha,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Payments as PaymentsIcon,
  Help as HelpIcon,
  CloudUpload as CloudUploadIcon,
  SaveAlt as SaveIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Home as HomeIcon,
  Wc as GenderIcon,
} from '@mui/icons-material';
import { ColorModeContext } from '../App';
import { useContext } from 'react';

export default function Profile() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Bar */}
      <Box 
        sx={{ 
          py: 2, 
          px: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)' 
            : 'linear-gradient(180deg, rgba(31,41,55,0.98) 0%, rgba(31,41,55,0.95) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">My Profile</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information and preferences
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* User Info Section */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              mb: { xs: 3, md: 0 }, 
              height: '100%',
              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
              boxShadow: theme.palette.mode === 'light'
                ? '0px 8px 20px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)'
                : '0px 8px 20px rgba(0, 0, 0, 0.3), 0px 0px 0px 1px rgba(255, 255, 255, 0.05)',
              '&:hover': {
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                transform: 'translateY(-5px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <Box 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    borderRadius: '16px 16px 0 0',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)}, ${alpha(theme.palette.primary.light, 0.4)})`,
                  }
                }}
              >
                <Box sx={{ position: 'relative', mb: 3, pt: 4 }}>
                  <Avatar 
                    src="/user-avatar.jpg" 
                    alt="User" 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mb: 2,
                      mx: 'auto',
                      border: '4px solid',
                      borderColor: 'background.paper',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Typography variant="h5" gutterBottom fontWeight="bold">John Doe</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    john.doe@example.com
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<CloudUploadIcon />}
                      size="small"
                      color="primary"
                      sx={{ 
                        borderRadius: 5, 
                        px: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      Upload Photo
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box 
                  sx={{ 
                    textAlign: 'left',
                    p: 2, 
                    borderRadius: 3,
                    background: theme.palette.mode === 'light' 
                      ? alpha(theme.palette.primary.main, 0.05) 
                      : alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="primary.main">
                    Plan Details
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Current Plan</Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">Premium</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Joined</Typography>
                    <Typography variant="body2">June 12, 2023</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Renewal Date</Typography>
                    <Typography variant="body2">July 12, 2024</Typography>
                  </Box>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    mt: 3,
                    borderRadius: 5,
                    py: 1.2,
                    boxShadow: '0 6px 15px rgba(34, 197, 94, 0.25)',
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      boxShadow: '0 8px 20px rgba(34, 197, 94, 0.3)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Upgrade Plan
                </Button>
              </Box>
            </Card>
          </Grid>
          
          {/* Profile Form Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              mb: 3,
              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
              boxShadow: theme.palette.mode === 'light'
                ? '0px 8px 20px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)'
                : '0px 8px 20px rgba(0, 0, 0, 0.3), 0px 0px 0px 1px rgba(255, 255, 255, 0.05)',
              '&:hover': {
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        color: 'primary.main', 
                        mr: 2,
                        width: 44,
                        height: 44
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">Personal Information</Typography>
                  </Box>
                  <Button 
                    startIcon={<EditIcon />} 
                    size="small" 
                    variant="contained" 
                    color="primary"
                    sx={{ 
                      borderRadius: 5, 
                      boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 14px rgba(34, 197, 94, 0.25)',
                      }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue="John"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <BadgeIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue="Doe"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <BadgeIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue="john.doe@example.com"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      defaultValue="+1 (555) 123-4567"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      defaultValue="male"
                      variant="outlined"
                      InputProps={{
                        startAdornment: <GenderIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Birth Date"
                      type="date"
                      defaultValue="1990-01-01"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      InputProps={{
                        startAdornment: <CakeIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      defaultValue="123 Main St, Anytown, CA 12345"
                      variant="outlined"
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: <HomeIcon color="action" sx={{ mr: 1, mt: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    sx={{ 
                      borderRadius: 5, 
                      px: 3,
                      boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        boxShadow: '0 6px 14px rgba(34, 197, 94, 0.25)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Card sx={{ 
              border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`,
              boxShadow: theme.palette.mode === 'light'
                ? '0px 8px 20px rgba(0, 0, 0, 0.06), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)'
                : '0px 8px 20px rgba(0, 0, 0, 0.3), 0px 0px 0px 1px rgba(255, 255, 255, 0.05)',
              '&:hover': {
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1), 
                      color: 'primary.main', 
                      mr: 2,
                      width: 44,
                      height: 44
                    }}
                  >
                    <SecurityIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" color="primary.main">Preferences & Security</Typography>
                </Box>
                
                <List sx={{ width: '100%' }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItem 
                      secondaryAction={
                        <Switch 
                          edge="end"
                          checked={theme.palette.mode === 'dark'}
                          onChange={colorMode.toggleColorMode}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.warning.main, 0.1), 
                            color: theme.palette.mode === 'dark' ? 'primary.main' : 'warning.main', 
                          }}
                        >
                          {theme.palette.mode === 'dark' ? '🌙' : '☀️'}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            Dark Mode
                          </Typography>
                        }
                        secondary="Enable dark theme for the application" 
                      />
                    </ListItem>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItem 
                      secondaryAction={
                        <Switch 
                          edge="end"
                          defaultChecked
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette.info.main, 0.1), 
                            color: 'info.main', 
                          }}
                        >
                          <EmailIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            Email Notifications
                          </Typography>
                        }
                        secondary="Receive weekly progress reports via email" 
                      />
                    </ListItem>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItem 
                      secondaryAction={
                        <Switch 
                          edge="end"
                          defaultChecked
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette.warning.main, 0.1), 
                            color: 'warning.main', 
                          }}
                        >
                          <NotificationsIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            Push Notifications
                          </Typography>
                        }
                        secondary="Get alerts for activity reminders and goals" 
                      />
                    </ListItem>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItem 
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 5,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                          }}
                        >
                          Change
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1), 
                            color: 'success.main', 
                          }}
                        >
                          <PaymentsIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            Payment Method
                          </Typography>
                        }
                        secondary="Visa ending in 4242" 
                      />
                    </ListItem>
                  </Paper>
                  
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'error.main',
                      }
                    }}
                  >
                    <ListItem 
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error"
                          sx={{ 
                            borderRadius: 5,
                          }}
                        >
                          Delete
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(theme.palette.error.main, 0.1), 
                            color: 'error.main', 
                          }}
                        >
                          <HelpIcon />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            Account
                          </Typography>
                        }
                        secondary="Delete your account and all data" 
                      />
                    </ListItem>
                  </Paper>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 