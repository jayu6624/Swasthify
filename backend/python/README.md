# SnapMeal Python Backend

This directory contains the Python backend for the SnapMeal AI-powered meal analysis feature.

## Files

- `meal_analyzer.py` - Main meal analysis script using Gemini AI and Nutritionix API
- `requirements.txt` - Python dependencies
- `setup.py` - Setup script to install dependencies

## Setup Instructions

### 1. Install Python Dependencies

Run the setup script:

```bash
cd backend/python
python setup.py
```

Or install manually:

```bash
pip install -r requirements.txt
```

### 2. Required Dependencies

- `google-generativeai` - For Gemini AI image analysis
- `Pillow` - For image processing
- `requests` - For API calls to Nutritionix
- `python-dotenv` - For environment variables
- `absl-py` - For logging

### 3. API Keys

The meal analyzer uses:

- **Gemini AI API Key** - Already configured in the script
- **Nutritionix API** - Already configured in the script

### 4. Testing

Test the Python script directly:

```bash
python meal_analyzer.py path/to/image.jpg
```

## Integration with Node.js Backend

The Python script is called from the Node.js backend via:

- `POST /api/snap/upload` - Upload image
- `POST /api/snap/analyze` - Analyze uploaded image

The Node.js backend spawns the Python process and handles the communication.

## Error Handling

- Image validation (format, size)
- API error handling
- Python process error handling
- Automatic cleanup of temporary files
