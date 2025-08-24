import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  Utensils,
  Scale,
  Zap,
  Heart,
  Apple,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/images/logo.jpg";

const SnapMeal = ({ userGoals, onConfirmMeal }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState({});
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  });

  const percentOf = (value, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.round((value / goal) * 100);
  };

  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (files) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError("");
    setAnalysisResults(null);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    dropAreaRef.current?.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dropAreaRef.current?.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropAreaRef.current?.classList.remove("border-blue-500", "bg-blue-50");
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  // Analyze meal
  const analyzeMeal = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // First, upload the image to your backend
      const uploadResponse = await fetch(
        "http://localhost:4000/api/snap/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();

      // Then analyze the uploaded image
      const analysisResponse = await fetch(
        "http://localhost:4000/api/snap/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imagePath: uploadData.imagePath,
          }),
        }
      );

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze image");
      }

      const results = await analysisResponse.json();

      if (results.error) {
        throw new Error(results.error);
      }

      setAnalysisResults(results);
      calculateTotals(results.final_analysis || []);
      toast.success("Meal analyzed successfully!");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze meal");
      toast.error("Failed to analyze meal. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate totals
  const calculateTotals = (foodItems) => {
    const totals = foodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
        protein: acc.protein + (item.protein || 0),
        carbs: acc.carbs + (item.carbohydrates || 0),
        fats: acc.fats + (item.fats || 0),
        fiber: acc.fiber + (item.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
    );

    setTotals(totals);
  };

  // Handle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Initialize edited items with current values
      const initialEdited = {};
      analysisResults?.final_analysis?.forEach((item, index) => {
        initialEdited[index] = { ...item };
      });
      setEditedItems(initialEdited);
    }
  };

  // Handle value changes in edit mode
  const handleValueChange = (index, field, value) => {
    setEditedItems((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  // Save edited values
  const saveEdits = () => {
    const updatedItems = analysisResults.final_analysis.map((item, index) => ({
      ...item,
      ...editedItems[index],
    }));

    setAnalysisResults({
      ...analysisResults,
      final_analysis: updatedItems,
    });

    calculateTotals(updatedItems);
    setIsEditMode(false);
    toast.success("Changes saved successfully!");
  };

  // Reset everything
  const resetApp = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setAnalysisResults(null);
    setError("");
    setIsEditMode(false);
    setEditedItems({});
    setTotals({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format quantity with unit
  const formatQuantity = (quantity, unit) => {
    if (!quantity) return "";
    return `${quantity} ${unit || "g"}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Upload Section */}
          {!analysisResults && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Upload Area */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Analyze Your Meal
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Simply take a photo or upload an image of your meal, and our
                    AI will instantly provide detailed nutritional information
                    including calories, protein, carbs, fats, and fiber.
                  </p>
                </div>

                <div
                  ref={dropAreaRef}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 hover:bg-blue-50"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto max-h-64 rounded-lg shadow-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetApp();
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Choose different image
                      </button>
                    </div>
                  )}
                </div>

                {previewUrl && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={analyzeMeal}
                      disabled={isAnalyzing}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Utensils className="w-5 h-5" />
                          <span>Analyze Meal</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Instant Analysis
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get detailed nutritional breakdown in seconds using advanced
                    AI technology.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Scale className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Accurate Measurements
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Precise calorie and macro calculations based on serving
                    sizes and ingredients.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Health Insights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Understand how your meal fits into your daily nutrition
                    goals.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading Section */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Analyzing Your Meal
                </h3>
                <p className="text-gray-600">
                  Our AI is examining your food and calculating nutritional
                  information...
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Section */}
          {analysisResults && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header with actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Analysis Results
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Detailed nutritional breakdown of your meal
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditMode ? "Cancel Edit" : "Edit Values"}</span>
                  </button>
                  {isEditMode && (
                    <button
                      onClick={saveEdits}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  )}
                  {!isEditMode && analysisResults && onConfirmMeal && (
                    <button
                      onClick={() => {
                        onConfirmMeal?.(totals);
                        toast.success("Meal added to dashboard");
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Meal</span>
                    </button>
                  )}
                  <button
                    onClick={resetApp}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>New Analysis</span>
                  </button>
                </div>
              </div>

              {/* Nutrition Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Total Nutrition
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">
                      {Math.round(totals.calories)}
                    </div>
                    <div className="text-sm text-gray-600">Calories</div>
                    {userGoals?.calorieGoal ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {percentOf(totals.calories, userGoals.calorieGoal)}% of
                        goal
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(totals.protein)}g
                    </div>
                    <div className="text-sm text-gray-600">Protein</div>
                    {userGoals?.proteinGoal ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {percentOf(totals.protein, userGoals.proteinGoal)}% of
                        goal
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">
                      {Math.round(totals.carbs)}g
                    </div>
                    <div className="text-sm text-gray-600">Carbs</div>
                    {userGoals?.carbsGoal ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {percentOf(totals.carbs, userGoals.carbsGoal)}% of goal
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(totals.fats)}g
                    </div>
                    <div className="text-sm text-gray-600">Fats</div>
                    {userGoals?.fatGoal ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {percentOf(totals.fats, userGoals.fatGoal)}% of goal
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(totals.fiber)}g
                    </div>
                    <div className="text-sm text-gray-600">Fiber</div>
                    {userGoals?.fiberGoal ? (
                      <div className="text-xs text-gray-500 mt-1">
                        {percentOf(totals.fiber, userGoals.fiberGoal)}% of goal
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Food Items */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysisResults.final_analysis?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatQuantity(item.quantity, item.quantity_unit)}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Calories
                          </span>
                          <span className="font-medium">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={
                                  editedItems[index]?.calories ||
                                  item.calories ||
                                  0
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    "calories",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                              />
                            ) : (
                              Math.round(item.calories || 0)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Protein</span>
                          <span className="font-medium">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={
                                  editedItems[index]?.protein ||
                                  item.protein ||
                                  0
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    "protein",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                              />
                            ) : (
                              `${Math.round(item.protein || 0)}g`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Carbs</span>
                          <span className="font-medium">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={
                                  editedItems[index]?.carbohydrates ||
                                  item.carbohydrates ||
                                  0
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    "carbohydrates",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                              />
                            ) : (
                              `${Math.round(item.carbohydrates || 0)}g`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fats</span>
                          <span className="font-medium">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={
                                  editedItems[index]?.fats || item.fats || 0
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    "fats",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                              />
                            ) : (
                              `${Math.round(item.fats || 0)}g`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fiber</span>
                          <span className="font-medium">
                            {isEditMode ? (
                              <input
                                type="number"
                                value={
                                  editedItems[index]?.fiber || item.fiber || 0
                                }
                                onChange={(e) =>
                                  handleValueChange(
                                    index,
                                    "fiber",
                                    e.target.value
                                  )
                                }
                                className="w-20 px-2 py-1 border rounded text-right"
                              />
                            ) : (
                              `${Math.round(item.fiber || 0)}g`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Health Insights */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Health Insights
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Apple className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Daily Calorie Intake
                        </p>
                        <p className="text-sm text-gray-600">
                          This meal provides{" "}
                          {percentOf(totals.calories, userGoals?.calorieGoal)}%
                          of your daily calorie needs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Scale className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Protein Content
                        </p>
                        <p className="text-sm text-gray-600">
                          {percentOf(totals.protein, userGoals?.proteinGoal)}%
                          of daily protein recommendation
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Energy Balance
                        </p>
                        <p className="text-sm text-gray-600">
                          {totals.calories > 800
                            ? "High-calorie meal"
                            : "Moderate calorie meal"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Fiber Content
                        </p>
                        <p className="text-sm text-gray-600">
                          {totals.fiber > 5
                            ? "Good fiber content"
                            : "Consider adding more fiber"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Section */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Analysis Error
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={resetApp}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SnapMeal;
