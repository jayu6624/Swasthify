import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Card, 
  CardContent,
  Grid,
  Paper,
  Divider,
  IconButton,
  TextField,
  CircularProgress,
  useTheme,
  alpha,
  Avatar,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  AddAPhoto as AddPhotoIcon,
  PhotoCamera as CameraIcon,
  History as HistoryIcon,
  Send as SendIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Restaurant as RestaurantIcon,
  LocalDining as DiningIcon,
  Add as AddIcon,
  Scale as MeasureIcon,
  FitnessCenter as ProteinIcon,
  Grass as CarbsIcon,
  WaterDrop as FatIcon,
  Fastfood as FastfoodIcon,
  CloudUpload as CloudUploadIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';

// CSS styles converted to styled components
const styles = {
  hidden: {
    display: 'none !important',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  section: {
    margin: '2rem 0',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  dropArea: {
    border: '2px dashed #6366f1',
    borderRadius: '0.5rem',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '600px',
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.05)',
    },
  },
  highlight: {
    borderColor: '#4f46e5',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  uploadIcon: {
    fontSize: '3rem',
    color: '#6366f1',
    marginBottom: '1rem',
  },
  uploadText: {
    marginBottom: '1rem',
  },
  fileInfo: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  previewContainer: {
    marginTop: '1rem',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  loadingSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  resultsHeader: {
    marginBottom: '2rem',
  },
  totalNutrition: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  nutritionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  nutritionGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  nutritionItem: {
    flex: '1 0 18%',
    minWidth: '120px',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '2rem',
  },
  foodCard: {
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
  },
  foodCardHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodCardName: {
    fontSize: '1.125rem',
    fontWeight: '600',
  },
  foodCardQuantity: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  foodCardBody: {
    padding: '1rem',
  },
  foodCardNutrient: {
    padding: '0.5rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #f3f4f6',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: '#f9fafb',
    },
  },
  nutrientLabel: {
    color: '#4b5563',
  },
  nutrientValue: {
    fontWeight: '500',
    color: '#1f2937',
  },
  foodCardEdit: {
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
    display: 'none',
  },
  active: {
    display: 'block',
  },
  editGroup: {
    marginBottom: '1rem',
  },
  editRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: '0.5rem',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  errorIcon: {
    fontSize: '3rem',
    color: '#ef4444',
    marginBottom: '1rem',
  },
};

// Array of glassy gradients for cards
const cardGradients = [
  {
    primary: 'linear-gradient(135deg, rgba(139, 195, 74, 0.4), rgba(104, 159, 56, 0.6))',
    hover: 'linear-gradient(135deg, rgba(139, 195, 74, 0.6), rgba(104, 159, 56, 0.8))'
  },
  {
    primary: 'linear-gradient(135deg, rgba(33, 150, 243, 0.4), rgba(25, 118, 210, 0.6))',
    hover: 'linear-gradient(135deg, rgba(33, 150, 243, 0.6), rgba(25, 118, 210, 0.8))'
  },
  {
    primary: 'linear-gradient(135deg, rgba(233, 30, 99, 0.4), rgba(194, 24, 91, 0.6))',
    hover: 'linear-gradient(135deg, rgba(233, 30, 99, 0.6), rgba(194, 24, 91, 0.8))'
  },
  {
    primary: 'linear-gradient(135deg, rgba(255, 193, 7, 0.4), rgba(255, 111, 0, 0.6))',
    hover: 'linear-gradient(135deg, rgba(255, 193, 7, 0.6), rgba(255, 111, 0, 0.8))'
  },
  {
    primary: 'linear-gradient(135deg, rgba(156, 39, 176, 0.4), rgba(123, 31, 162, 0.6))',
    hover: 'linear-gradient(135deg, rgba(156, 39, 176, 0.6), rgba(123, 31, 162, 0.8))'
  },
  {
    primary: 'linear-gradient(135deg, rgba(0, 188, 212, 0.4), rgba(0, 151, 167, 0.6))',
    hover: 'linear-gradient(135deg, rgba(0, 188, 212, 0.6), rgba(0, 151, 167, 0.8))'
  }
];

export default function SnapMeal() {
  // State variables
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isDropHighlighted, setIsDropHighlighted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0
  });
  const [notification, setNotification] = useState({ show: false, message: '', severity: 'info' });
  
  // Refs
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const theme = useTheme();
  
  // Handle file drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropHighlighted(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };
  
  // Handle selected files
  const handleFiles = (files) => {
    const file = files[0];
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      resetUpload();
      setShowResults(false);
      return;
    }
    
    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };
  
  // Reset upload state
  const resetUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    setPreviewUrl('');
  };
  
  // Reset the entire app state
  const resetApp = () => {
    resetUpload();
    setError('');
    setShowResults(false);
    setAnalysisResults(null);
    setIsEditMode(false);
    setNutritionTotals({
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0
    });
  };
  
  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError('');
    
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('foodImage', selectedFile);
    
    try {
      // Send request to the server with CORS credentials
      const response = await axios.post('http://localhost:3000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Add CORS settings
        withCredentials: false
      });
      
      if (response.data) {
        const serverData = response.data;
        console.log('Analysis results:', serverData);
        
        // Transform server data to match the expected format
        const transformedData = {
          status: 'success',
          food_items: []
        };
        
        if (serverData.final_analysis && Array.isArray(serverData.final_analysis)) {
          // Transform each item in the final_analysis array
          transformedData.food_items = serverData.final_analysis.map(item => {
            // Log the item to see all available fields
            console.log('Processing food item:', item);
            
            // Check if we have carbs/fats with different property names
            const carbsValue = item.carbs || item.carbohydrates || item.carbs_total || 0;
            const fatsValue = item.fat || item.fats || item.fat_total || item.total_fat || 0;
            
            return {
              name: item.name || 'Unknown Food',
              quantity: { 
                amount: item.quantity || 0, 
                unit: item.quantity_unit || 'g' 
              },
              nutrition: {
                calories: item.calories || 0,
                protein: { amount: item.protein || 0 },
                carbs: { amount: carbsValue },
                fat: { amount: fatsValue },
                fiber: { amount: item.fiber || 0 }
              }
            };
          });
        }
        
        setAnalysisResults(transformedData);
        
        // Calculate nutrition totals
        calculateTotals(transformedData.food_items);
        
        setShowResults(true);
        
        // Show success notification
        setNotification({
          show: true,
          message: "Analysis completed successfully!",
          severity: "success"
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      
      // Show detailed error for debugging
      let errorMessage = 'Error analyzing image. ';
      if (err.response) {
        // Server responded with an error status
        errorMessage += `Server returned ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
        console.log('Error response:', err.response);
      } else if (err.request) {
        // Request was made but no response
        errorMessage += "No response received from server. Make sure the server is running at http://localhost:3000";
        console.log('Error request:', err.request);
      } else {
        // Something else happened
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      
      // Use mock data as fallback
      console.log('Using mock data as fallback due to server error');
      
      // Mock data structure similar to what we expect from the API
      const mockData = {
        status: 'success',
        food_items: [
          {
            name: 'Grilled Chicken',
            quantity: { amount: 100, unit: 'g' },
            nutrition: {
              calories: 165,
              protein: { amount: 31 },
              carbs: { amount: 0 },
              fat: { amount: 3.6 },
              fiber: { amount: 0 }
            }
          },
          {
            name: 'Brown Rice',
            quantity: { amount: 150, unit: 'g' },
            nutrition: {
              calories: 216,
              protein: { amount: 5 },
              carbs: { amount: 45 },
              fat: { amount: 1.8 },
              fiber: { amount: 3.5 }
            }
          },
          {
            name: 'Broccoli',
            quantity: { amount: 100, unit: 'g' },
            nutrition: {
              calories: 34,
              protein: { amount: 2.8 },
              carbs: { amount: 7 },
              fat: { amount: 0.4 },
              fiber: { amount: 2.6 }
            }
          }
        ]
      };
      
      setAnalysisResults(mockData);
      calculateTotals(mockData.food_items);
      setShowResults(true);
      setNotification({
        show: true,
        message: "Using mock data due to server connection issue. Error: " + err.message,
        severity: "warning"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate nutrition totals from food items
  const calculateTotals = (foodItems) => {
    if (!foodItems || !Array.isArray(foodItems)) return;
    
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0
    };
    
    foodItems.forEach(item => {
      if (item.nutrition) {
        // Log each item's nutrition to debug
        console.log(`Totaling nutrition for ${item.name}:`, item.nutrition);
        
        // Handle different formats and ensure we have numbers
        totals.calories += parseFloat(item.nutrition.calories || 0);
        totals.protein += parseFloat(item.nutrition.protein?.amount || 0);
        totals.carbs += parseFloat(item.nutrition.carbs?.amount || 0);
        totals.fats += parseFloat(item.nutrition.fat?.amount || 0);
        totals.fiber += parseFloat(item.nutrition.fiber?.amount || 0);
      }
    });
    
    console.log('Final nutrition totals:', totals);
    setNutritionTotals(totals);
  };
  
  // Update nutrition totals based on edited values
  const updateTotalsFromEdits = () => {
    if (!analysisResults || !analysisResults.food_items) return;
    
    // In a real app, you would gather values from all edit inputs
    // For this demo, we'll just recalculate from the original data
    calculateTotals(analysisResults.food_items);
  };
  
  // Handle edit mode toggle
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Handle confirm button click
  const handleConfirm = () => {
    if (isEditMode) {
      // Apply edits
      updateTotalsFromEdits();
      setIsEditMode(false);
    }
    
    // In a real app, you would save the data to a database or state
    setNotification({
      show: true,
      message: 'Analysis confirmed! You can now use this data for your meal planning.',
      severity: "success"
    });
    resetApp();
  };
  
  // Format quantity with unit
  const formatQuantityWithUnit = (quantity, unit) => {
    if (!quantity) return '0';
    
    const numericValue = parseFloat(quantity);
    if (isNaN(numericValue)) return '0';
    
    return `${numericValue.toFixed(1)}${unit || ''}`;
  };
  
  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, show: false });
  };
  
  // Food card component
  const FoodCard = ({ food, index }) => {
    if (!food) return null;
    
    // Select a gradient based on the index, cycling through available gradients
    const gradientIndex = index % cardGradients.length;
    const gradient = cardGradients[gradientIndex];
    
    return (
      <Card 
        sx={{ 
          ...styles.foodCard, 
          background: gradient.primary,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            ...styles.foodCard['&:hover'],
            background: gradient.hover,
          }
        }}
      >
        <Box sx={{
          ...styles.foodCardHeader,
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          <Typography variant="subtitle1" sx={{
            ...styles.foodCardName,
            color: 'rgba(0, 0, 0, 0.87)',
            textTransform: 'capitalize'
          }}>
            {food.name}
          </Typography>
          <Typography variant="body2" sx={{
            ...styles.foodCardQuantity,
            color: 'rgba(0, 0, 0, 0.6)'
          }}>
            {formatQuantityWithUnit(food.quantity?.amount, food.quantity?.unit)}
          </Typography>
        </Box>
        
        <Box sx={styles.foodCardBody}>
          {food.nutrition && (
            <>
              <Box sx={{
                ...styles.foodCardNutrient,
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Typography variant="body2" sx={styles.nutrientLabel}>Calories</Typography>
                <Typography variant="body2" sx={styles.nutrientValue}>
                  {Math.round(food.nutrition.calories || 0)} kcal
                </Typography>
              </Box>
              <Box sx={{
                ...styles.foodCardNutrient,
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Typography variant="body2" sx={styles.nutrientLabel}>Protein</Typography>
                <Typography variant="body2" sx={styles.nutrientValue}>
                  {formatQuantityWithUnit(food.nutrition.protein?.amount, 'g')}
                </Typography>
              </Box>
              <Box sx={{
                ...styles.foodCardNutrient,
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Typography variant="body2" sx={styles.nutrientLabel}>Carbs</Typography>
                <Typography variant="body2" sx={styles.nutrientValue}>
                  {formatQuantityWithUnit(food.nutrition.carbs?.amount, 'g')}
                </Typography>
              </Box>
              <Box sx={{
                ...styles.foodCardNutrient,
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Typography variant="body2" sx={styles.nutrientLabel}>Fat</Typography>
                <Typography variant="body2" sx={styles.nutrientValue}>
                  {formatQuantityWithUnit(food.nutrition.fat?.amount, 'g')}
                </Typography>
              </Box>
              <Box sx={{
                ...styles.foodCardNutrient,
                borderBottom: 'none',
              }}>
                <Typography variant="body2" sx={styles.nutrientLabel}>Fiber</Typography>
                <Typography variant="body2" sx={styles.nutrientValue}>
                  {formatQuantityWithUnit(food.nutrition.fiber?.amount, 'g')}
                </Typography>
              </Box>
            </>
          )}
        </Box>
        
        <Box sx={{ 
          ...styles.foodCardEdit, 
          ...(isEditMode ? styles.active : {}),
          borderTop: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <Box sx={styles.editGroup}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Adjust Quantity
            </Typography>
            <Box sx={styles.editRow}>
              <TextField
                size="small"
                type="number"
                label="Amount"
                defaultValue={food.quantity?.amount || 1}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                size="small"
                label="Unit"
                defaultValue={food.quantity?.unit || 'serving'}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Box>
          
          <Box sx={styles.editGroup}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Adjust Nutrition
            </Typography>
            <Box sx={styles.editRow}>
              <TextField
                size="small"
                type="number"
                label="Calories"
                defaultValue={Math.round(food.nutrition?.calories || 0)}
                inputProps={{ min: 0 }}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={styles.editRow}>
              <TextField
                size="small"
                type="number"
                label="Protein (g)"
                defaultValue={food.nutrition?.protein?.amount || 0}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                size="small"
                type="number"
                label="Carbs (g)"
                defaultValue={food.nutrition?.carbs?.amount || 0}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ flexGrow: 1 }}
              />
            </Box>
            <Box sx={styles.editRow}>
              <TextField
                size="small"
                type="number"
                label="Fat (g)"
                defaultValue={food.nutrition?.fat?.amount || 0}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                size="small"
                type="number"
                label="Fiber (g)"
                defaultValue={food.nutrition?.fiber?.amount || 0}
                inputProps={{ min: 0, step: 0.1 }}
                sx={{ flexGrow: 1 }}
              />
            </Box>
          </Box>
        </Box>
      </Card>
    );
  };
  
  // Effect for drag and drop events
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;
    
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    const highlight = () => {
      setIsDropHighlighted(true);
    };
    
    const unhighlight = () => {
      setIsDropHighlighted(false);
    };
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unhighlight, false);
      });
      
      dropArea.removeEventListener('drop', handleDrop, false);
    };
  }, []);
  
  return (
    <Box sx={{ pb: 6 }}>
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.show} 
        autoHideDuration={6000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

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
          <Typography variant="h5" fontWeight="bold">Snap Meal</Typography>
          <Typography variant="body2" color="text.secondary">
            Use your camera to log meals and get nutritional information
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Upload Section */}
        <Box sx={{ 
          ...styles.section, 
          display: !isLoading && !showResults && !error ? 'block' : 'none' 
        }}>
          <Box sx={styles.uploadContainer}>
            <Box 
              ref={dropAreaRef}
              sx={{ 
                ...styles.dropArea, 
                ...(isDropHighlighted ? styles.highlight : {}),
                bgcolor: 'background.paper',
                border: `2px dashed ${theme.palette.primary.main}`,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                }
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              <Box sx={{ display: previewUrl ? 'none' : 'block' }}>
                <CloudUploadIcon sx={{ 
                  fontSize: '3rem', 
                  color: theme.palette.primary.main, 
                  mb: 2 
                }} />
                <Typography variant="body1" sx={styles.uploadText}>
                  <strong>Click to upload</strong> or drag and drop
                </Typography>
                <Typography variant="body2" sx={styles.fileInfo}>
                  SVG, PNG, JPG or GIF (max. 10MB)
                </Typography>
              </Box>
              
              {previewUrl && (
                <Box sx={styles.previewContainer}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={styles.previewImage} 
                  />
                  <Button 
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetUpload();
                    }}
                    sx={{ mr: 2 }}
                  >
                    Change Image
                  </Button>
                </Box>
              )}
            </Box>
            
            <Button 
              variant="contained"
              disabled={!selectedFile}
              onClick={handleAnalyze}
              sx={{
                mt: 2,
                width: { xs: '100%', sm: 'auto' },
                minWidth: '150px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              Analyze Meal
            </Button>
          </Box>
        </Box>
        
        {/* Loading Section */}
        <Box sx={{ 
          ...styles.section, 
          ...styles.loadingSection,
          display: isLoading ? 'flex' : 'none' 
        }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Analyzing your meal... Please wait</Typography>
        </Box>
        
        {/* Error Section */}
        <Box sx={{ 
          ...styles.section, 
          display: error ? 'block' : 'none' 
        }}>
          <Box sx={{ 
            ...styles.errorContainer,
            bgcolor: alpha(theme.palette.error.main, 0.1),
          }}>
            <ErrorIcon sx={{ 
              fontSize: '3rem', 
              color: theme.palette.error.main, 
              mb: 2 
            }} />
            <Typography variant="h6" gutterBottom>Analysis Error</Typography>
            <Typography variant="body1" paragraph>
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={resetApp}
            >
              Try Again
            </Button>
          </Box>
        </Box>
        
        {/* Results Section */}
        <Box sx={{ 
          ...styles.section, 
          display: showResults && !isLoading && !error ? 'block' : 'none' 
        }}>
          <Box sx={styles.resultsHeader}>
            <Typography variant="h5" gutterBottom>Analysis Results</Typography>
            
            <Card sx={{ 
              mb: 4,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Nutrition</Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Typography variant="body2" color="text.secondary">Calories</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {Math.round(nutritionTotals.calories)} kcal
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Typography variant="body2" color="text.secondary">Protein</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {nutritionTotals.protein.toFixed(1)}g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Typography variant="body2" color="text.secondary">Carbs</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {nutritionTotals.carbs.toFixed(1)}g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Typography variant="body2" color="text.secondary">Fats</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {nutritionTotals.fats.toFixed(1)}g
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2.4}>
                    <Typography variant="body2" color="text.secondary">Fiber</Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {nutritionTotals.fiber.toFixed(1)}g
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          
          <Box sx={styles.cardsContainer}>
            {analysisResults && analysisResults.food_items && 
             analysisResults.food_items.map((food, index) => (
               <FoodCard key={index} food={food} index={index} />
             ))}
          </Box>
          
          <Box sx={styles.actionsContainer}>
            <Button 
              variant="outlined"
              color={isEditMode ? "warning" : "primary"}
              onClick={toggleEditMode}
            >
              {isEditMode ? 'Cancel Editing' : 'Edit Values'}
            </Button>
            <Button 
              variant="contained"
              onClick={handleConfirm}
              startIcon={<CheckIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                }
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 