import { useState, useMemo, useCallback, memo } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Paper,
  Popover,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  RestaurantMenu as MealIcon,
  DirectionsRun as ActivityIcon,
  Bolt as EnergyIcon,
  MonitorWeight as WeightIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  NightlightRound as DarkModeIcon,
  LightMode as LightModeIcon,
} from "@mui/icons-material";
import { format, addDays, subDays } from "date-fns";
import { styled } from "@mui/material/styles";
import { ColorModeContext } from "../App";
import { useContext } from "react";
import { alpha } from "@mui/material/styles";

// Styled components
const GradientCard = styled(Card)(({ theme, color = "primary" }) => ({
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "5px",
    background: theme.palette[color].main,
  },
}));

const IconAvatar = styled(Avatar)(({ theme, color = "primary" }) => ({
  backgroundColor: theme.palette[color].main,
  color: theme.palette[color].contrastText,
}));

// Circular progress component for calorie intake
const CircularProgressWithLabel = memo(({ value, size = 150 }) => {
  const theme = useTheme();
  const circumference = useMemo(() => 2 * Math.PI * 65, []); // Increased radius
  const strokeDashoffset = useMemo(
    () => circumference - (value / 100) * circumference,
    [circumference, value]
  );

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
        }}
      >
        <svg width={size} height={size} viewBox="0 0 150 150">
          {/* Glow effect for progress */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Background circle */}
          <circle
            cx="75"
            cy="75"
            r="65"
            fill="none"
            stroke={
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)"
            }
            strokeWidth="10"
          />

          {/* Highlight circle edge */}
          <circle
            cx="75"
            cy="75"
            r="65"
            fill="none"
            stroke={
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(255, 255, 255, 0.8)"
            }
            strokeWidth="1"
          />

          {/* Progress circle */}
          <circle
            cx="75"
            cy="75"
            r="65"
            fill="none"
            stroke={theme.palette.primary.main}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 75 75)"
            filter="url(#glow)"
            style={{
              transition: "stroke-dashoffset 1s ease-in-out",
            }}
          />
        </svg>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h4"
            component="div"
            fontWeight="bold"
            color="primary.main"
          >
            {Math.round(value)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            of daily goal
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

// Mock components that would be replaced with your actual components
const ActivityTracker = () => (
  <Box sx={{ p: 2 }}>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Today's Activity Summary
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {["Morning", "Afternoon", "Evening"].map((time) => (
        <Grid item xs={4} key={time}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {time}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {Math.floor(Math.random() * 300)} cal
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mt: 3 }}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            height: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Active Minutes
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <ActivityIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="medium">
              58 min
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={65}
            sx={{
              mt: 1.5,
              height: 8,
              borderRadius: 4,
              bgcolor: "background.paper",
              ".MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: "success.main",
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Goal: 90 minutes
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            height: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sleep Duration
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <EnergyIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="medium">
              7.3 hrs
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={85}
            sx={{
              mt: 1.5,
              height: 8,
              borderRadius: 4,
              bgcolor: "background.paper",
              ".MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: "info.main",
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Goal: 8 hours
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            height: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Steps Count
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <WeightIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h5" fontWeight="medium">
              8,294
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{
              mt: 1.5,
              height: 8,
              borderRadius: 4,
              bgcolor: "background.paper",
              ".MuiLinearProgress-bar": {
                borderRadius: 4,
                bgcolor: "warning.main",
              },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Goal: 10,000 steps
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

const WeeklyProgress = () => (
  <Box sx={{ p: 3 }}>
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" gutterBottom fontWeight="medium">
          Caloric Intake
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This Week vs Last Week
        </Typography>
      </Box>
      <Typography variant="h6" fontWeight="medium" color="primary">
        +5%
      </Typography>
    </Box>

    <Box sx={{ mb: 2 }}>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
        <Box key={day} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {day}
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {1200 + Math.floor(Math.random() * 1000)} cal
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={30 + Math.random() * 70}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "background.default",
              ".MuiLinearProgress-bar": {
                borderRadius: 4,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  </Box>
);

// More detailed nutrient progress component
const NutrientProgress = ({ label, value, target, color, icon }) => {
  const percentage = Math.min(100, (value / target) * 100);

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon && (
            <Avatar sx={{ width: 24, height: 24, bgcolor: color, mr: 1 }}>
              {icon}
            </Avatar>
          )}
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
        </Box>
        <Typography variant="body2">
          {value} / {target}g
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: "background.default",
          ".MuiLinearProgress-bar": {
            borderRadius: 4,
            bgcolor: color,
          },
        }}
      />
    </Box>
  );
};

// Enhanced meal list
const MealList = () => (
  <Box>
    {["Breakfast", "Lunch", "Dinner"].map((meal, index) => (
      <Box
        key={meal}
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          borderBottom: index < 2 ? "1px solid" : "none",
          borderColor: "divider",
          "&:hover": {
            transform: "translateY(-2px)",
            transition: "transform 0.2s ease-in-out",
          },
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: "primary.light",
            mr: 2,
            width: 56,
            height: 56,
            boxShadow: 3,
            border: "2px solid",
            borderColor: "background.paper",
          }}
        >
          <MealIcon />
        </Avatar>
        <Box sx={{ ml: 2, flex: 1 }}>
          <Typography variant="body1" fontWeight="medium">
            {meal}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.floor(Math.random() * 500) + 200} calories
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {meal === "Breakfast"
            ? "8:30 AM"
            : meal === "Lunch"
            ? "1:15 PM"
            : "7:00 PM"}
        </Typography>
      </Box>
    ))}
  </Box>
);

// New horizontal date selector
const HorizontalDateSelector = ({ selectedDate, setSelectedDate }) => {
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const date =
      i === 0
        ? new Date()
        : i < 0
        ? subDays(new Date(), Math.abs(i))
        : addDays(new Date(), i);
    dates.push(date);
  }

  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        pb: 1.5,
        pt: 1.5,
        px: 3,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        gap: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)"
            : "linear-gradient(180deg, rgba(31,41,55,0.95) 0%, rgba(31,41,55,0.9) 100%)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 64,
        zIndex: 8,
      }}
    >
      <IconButton
        size="small"
        sx={{
          alignSelf: "center",
          boxShadow: theme.palette.mode === "light" ? 1 : "none",
          bgcolor:
            theme.palette.mode === "light"
              ? "background.paper"
              : "background.default",
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      {dates.map((date, index) => {
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();

        return (
          <Button
            key={index}
            onClick={() => setSelectedDate(date)}
            variant={isSelected ? "contained" : "outlined"}
            sx={{
              minWidth: "auto",
              px: 2.5,
              py: 1.5,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              backgroundColor: isSelected
                ? "primary.main"
                : theme.palette.mode === "light"
                ? "background.paper"
                : "background.default",
              borderColor: isToday && !isSelected ? "primary.main" : "divider",
              whiteSpace: "nowrap",
              boxShadow: isSelected
                ? 4
                : theme.palette.mode === "light"
                ? 1
                : "none",
              transition: "all 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: isSelected ? 4 : 2,
              },
            }}
          >
            <Typography
              variant="caption"
              fontWeight="medium"
              color={isSelected ? "inherit" : "text.secondary"}
            >
              {format(date, "EEE")}
            </Typography>
            <Typography
              variant={isToday ? "h6" : "body1"}
              fontWeight={isToday ? "bold" : "medium"}
            >
              {format(date, "d")}
            </Typography>
          </Button>
        );
      })}

      <IconButton
        size="small"
        sx={{
          alignSelf: "center",
          boxShadow: theme.palette.mode === "light" ? 1 : "none",
          bgcolor:
            theme.palette.mode === "light"
              ? "background.paper"
              : "background.default",
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

// Memoize components that don't need frequent updates
const MemoizedActivityTracker = memo(ActivityTracker);
const MemoizedWeeklyProgress = memo(WeeklyProgress);
const MemoizedNutrientProgress = memo(NutrientProgress);
const MemoizedMealList = memo(MealList);

// Main Dashboard component
export default function Dashboard({ colorMode }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const theme = useTheme();
  const mode = theme.palette.mode;

  const handleNotificationsClick = useCallback((event) => {
    setNotificationAnchorEl(event.currentTarget);
  }, []);

  const handleNotificationsClose = useCallback(() => {
    setNotificationAnchorEl(null);
  }, []);

  const handleProfileClick = useCallback((event) => {
    setProfileAnchorEl(event.currentTarget);
  }, []);

  const handleProfileClose = useCallback(() => {
    setProfileAnchorEl(null);
  }, []);

  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setAnchorEl(null);
  };

  const notificationsOpen = Boolean(notificationAnchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  const open = Boolean(anchorEl);

  // Memoize values that don't need to change often
  const nutritionData = useMemo(
    () => ({
      calories: 1450,
      protein: 85,
      carbs: 180,
      fats: 45,
      fiber: 18,
    }),
    []
  );

  const progressBarColors = useMemo(
    () => ({
      success: theme.palette.success.main,
      info: theme.palette.info.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
    }),
    [theme]
  );

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Bar */}
      <Box
        sx={{
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)"
              : "linear-gradient(180deg, rgba(31,41,55,0.98) 0%, rgba(31,41,55,0.95) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="medium">
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track your health and fitness goals
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              color="default"
              onClick={handleNotificationsClick}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notificationAnchorEl}
            open={notificationsOpen}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: { width: 320, maxWidth: "100%" },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider />
            <List sx={{ py: 0 }}>
              {[
                {
                  title: "7 Day Streak!",
                  description: "You've logged your meals for 7 days in a row.",
                  icon: <EnergyIcon />,
                  color: "primary",
                },
                {
                  title: "Weekly Goal Achieved",
                  description: "You've reached your protein goal for the week.",
                  icon: <ActivityIcon />,
                  color: "success",
                },
                {
                  title: "New Workout Available",
                  description:
                    "Try our new HIIT workout designed for your fitness level.",
                  icon: <WeightIcon />,
                  color: "error",
                },
                {
                  title: "Monthly Report Ready",
                  description:
                    "Your health and fitness report for this month is now available.",
                  icon: <NotificationsIcon />,
                  color: "warning",
                },
              ].map((notification, index) => (
                <ListItem
                  key={index}
                  sx={{
                    py: 2,
                    px: 3,
                    "&:hover": { bgcolor: "action.hover" },
                    borderBottom: index < 3 ? "1px solid" : "none",
                    borderColor: "divider",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 44 }}>
                    <Avatar
                      sx={{
                        bgcolor: notification.color + ".light",
                        color: notification.color + ".main",
                        width: 36,
                        height: 36,
                      }}
                    >
                      {notification.icon}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.description}
                    primaryTypographyProps={{ variant: "subtitle2" }}
                    secondaryTypographyProps={{ variant: "body2" }}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
              <Button size="small">View All Notifications</Button>
            </Box>
          </Menu>

          <Tooltip title="Profile">
            <IconButton
              size="large"
              edge="end"
              color="default"
              onClick={handleProfileClick}
            >
              <Avatar
                src="/user-avatar.jpg"
                alt="User"
                sx={{
                  width: 36,
                  height: 36,
                  border: "2px solid",
                  borderColor: "primary.light",
                }}
              />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={profileAnchorEl}
            open={profileOpen}
            onClose={handleProfileClose}
            PaperProps={{
              sx: { width: 220 },
            }}
          >
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Avatar
                src="/user-avatar.jpg"
                alt="User"
                sx={{
                  width: 60,
                  height: 60,
                  border: "2px solid",
                  borderColor: "primary.light",
                  mx: "auto",
                  mb: 1,
                }}
              />
              <Typography variant="subtitle1" fontWeight="medium">
                John Doe
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Premium Plan
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={colorMode.toggleColorMode}>
              <ListItemIcon>
                {mode === "dark" ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={mode === "dark" ? "Light Mode" : "Dark Mode"}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Horizontal Date Selector */}
      <HorizontalDateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Calorie Intake Card - Larger with circular progress */}
            <Card
              sx={{
                mb: 3,
                overflow: "visible",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)"
                }`,
                "&:hover": {
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Calorie Intake
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={5} sx={{ textAlign: "center" }}>
                    <CircularProgressWithLabel value={72.5} />
                    <Typography
                      variant="body1"
                      sx={{ mt: 2, fontWeight: "medium" }}
                    >
                      1,450 / 2,000 calories
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Macronutrients Breakdown
                      </Typography>
                      <MemoizedNutrientProgress
                        label="Protein"
                        value={85}
                        target={120}
                        color="primary.main"
                      />
                      <MemoizedNutrientProgress
                        label="Carbs"
                        value={180}
                        target={250}
                        color="error.main"
                      />
                      <MemoizedNutrientProgress
                        label="Fat"
                        value={45}
                        target={65}
                        color="warning.main"
                      />
                      <MemoizedNutrientProgress
                        label="Fiber"
                        value={18}
                        target={30}
                        color="success.main"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Activity Tracker */}
            <Card
              sx={{
                mb: 3,
                overflow: "visible",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)"
                }`,
                "&:hover": {
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Today's Activity
                  </Typography>
                }
                subheader="Track your activities throughout the day"
              />
              <Divider />
              <MemoizedActivityTracker />
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Weekly Overview */}
            <Card
              sx={{
                mb: 3,
                overflow: "visible",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)"
                }`,
                "&:hover": {
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Weekly Overview
                  </Typography>
                }
                subheader="Your calorie intake for the past week"
              />
              <Divider />
              <MemoizedWeeklyProgress />
            </Card>

            {/* Additional micronutrients tracking */}
            <Card
              sx={{
                mb: 3,
                overflow: "visible",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)"
                }`,
                "&:hover": {
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(-3px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Micronutrients
                  </Typography>
                }
                subheader="Track your vitamin and mineral intake"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {[
                    {
                      name: "Vitamin C",
                      value: 75,
                      max: 90,
                      unit: "mg",
                      color: "success.main",
                    },
                    {
                      name: "Vitamin D",
                      value: 12,
                      max: 20,
                      unit: "μg",
                      color: "warning.main",
                    },
                    {
                      name: "Calcium",
                      value: 800,
                      max: 1000,
                      unit: "mg",
                      color: "info.main",
                    },
                    {
                      name: "Iron",
                      value: 12,
                      max: 18,
                      unit: "mg",
                      color: "error.main",
                    },
                  ].map((nutrient, index) => (
                    <Grid item xs={6} key={index}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "background.subtle",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          fontWeight="medium"
                        >
                          {nutrient.name}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <CircleIcon
                            sx={{ color: nutrient.color, fontSize: 12, mr: 1 }}
                          />
                          <Typography variant="body2" fontWeight="medium">
                            {nutrient.value}/{nutrient.max} {nutrient.unit}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(nutrient.value / nutrient.max) * 100}
                          sx={{
                            mt: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "background.default",
                            ".MuiLinearProgress-bar": {
                              bgcolor: nutrient.color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Full-width Today's Meals Card */}
          <Grid item xs={12}>
            <Card
              sx={{
                overflow: "visible",
                border: `1px solid ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)"
                }`,
                "&:hover": {
                  boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
                  transform: "translateY(-5px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold">
                    Today's Meals
                  </Typography>
                }
                subheader="Meals you've logged today"
                action={
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      },
                    }}
                  >
                    Add Meal
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  {["Breakfast", "Lunch", "Dinner", "Snacks"].map(
                    (mealType, index) => (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor:
                              theme.palette.mode === "light"
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(31,41,55,0.7)",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 3,
                            height: "100%",
                            transition: "all 0.2s",
                            overflow: "hidden",
                            position: "relative",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: 3,
                              "&::after": {
                                opacity: 1,
                              },
                            },
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(45deg, rgba(34, 197, 94, 0.1), transparent)",
                              opacity: 0,
                              transition: "opacity 0.3s",
                              pointerEvents: "none",
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                            fontWeight="bold"
                          >
                            {mealType}
                          </Typography>

                          {index < 3 ? (
                            <>
                              <Box
                                sx={{
                                  width: "100%",
                                  height: 140,
                                  bgcolor: "primary.light",
                                  borderRadius: 2,
                                  mb: 2,
                                  overflow: "hidden",
                                  backgroundImage:
                                    "linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow:
                                    "inset 0 0 0 1px rgba(255,255,255,0.1)",
                                  "&:hover": {
                                    transform: "scale(1.02)",
                                    transition: "transform 0.2s ease",
                                  },
                                }}
                              >
                                <MealIcon
                                  sx={{
                                    fontSize: 40,
                                    color: "primary.main",
                                    opacity: 0.7,
                                  }}
                                />
                              </Box>
                              <Typography variant="body2" fontWeight="medium">
                                {index === 0
                                  ? "Oatmeal with Berries"
                                  : index === 1
                                  ? "Grilled Chicken Salad"
                                  : "Salmon with Vegetables"}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                              >
                                {index === 0
                                  ? "320"
                                  : index === 1
                                  ? "450"
                                  : "580"}{" "}
                                calories
                              </Typography>
                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Button
                                  variant="text"
                                  size="small"
                                  color="primary"
                                  sx={{
                                    borderRadius: 3,
                                    "&:hover": {
                                      bgcolor: "primary.light",
                                      color: "primary.dark",
                                    },
                                  }}
                                >
                                  Details
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <Box
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                p: 3,
                                minHeight: 160,
                              }}
                            >
                              <AddIcon
                                sx={{
                                  fontSize: 40,
                                  color: "primary.main",
                                  mb: 2,
                                  opacity: 0.7,
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.1) rotate(90deg)",
                                  },
                                }}
                              />
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                sx={{
                                  borderRadius: 3,
                                  px: 2,
                                  borderWidth: 2,
                                  "&:hover": {
                                    borderWidth: 2,
                                    bgcolor: "primary.light",
                                    color: "primary.dark",
                                  },
                                }}
                              >
                                Add Snack
                              </Button>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    )
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
