# Healthcare Backend with SnapMeal AI

This backend includes a complete healthcare application with AI-powered meal analysis using Python integration.

## 🚀 Quick Start

### Option 1: Full Setup (Recommended)

```bash
npm run start:full
```

This will:

- Start the Node.js server
- Connect to MongoDB
- Automatically check and install Python dependencies
- Set up the SnapMeal AI environment
- Test the meal analyzer

### Option 2: Development Mode

```bash
npm run dev
```

This starts the server with nodemon for development.

### Option 3: Standard Start

```bash
npm start
```

This starts the server using the original server.js file.

## 🔧 Features

### Core Features

- User authentication (JWT + Google OAuth)
- User profiles and onboarding
- Database integration (MongoDB)

### SnapMeal AI Feature

- **AI-powered meal analysis** using Gemini AI
- **Image upload and processing**
- **Nutritional information extraction**
- **Real-time analysis results**
- **Editable nutrition values**

## 📁 Project Structure

```
backend/
├── app.js                 # Main application file
├── start.js              # Startup script with auto-setup
├── server.js             # Original server file
├── python/               # Python backend for SnapMeal
│   ├── meal_analyzer.py  # AI meal analysis script
│   ├── requirements.txt  # Python dependencies
│   ├── setup.py         # Python setup script
│   └── autoSetup.js     # Node.js auto-setup for Python
├── routes/               # API routes
│   ├── snapRoutes.js    # SnapMeal API endpoints
│   └── ...              # Other routes
└── ...
```

## 🐍 Python Integration

The backend automatically:

1. **Checks Python installation**
2. **Installs required packages** (google-generativeai, Pillow, requests, etc.)
3. **Tests the meal analyzer**
4. **Provides error handling** if setup fails

### Manual Python Setup (if needed)

```bash
cd python
python setup.py
```

## 🔌 API Endpoints

### SnapMeal Endpoints

- `POST /api/snap/upload` - Upload food image
- `POST /api/snap/analyze` - Analyze uploaded image
- `GET /api/snap/history` - Get analysis history (future)

### Other Endpoints

- User authentication and profile management
- Google OAuth integration
- Onboarding data collection

## 🛠️ Dependencies

### Node.js Dependencies

- Express.js
- MongoDB (Mongoose)
- JWT authentication
- Google OAuth (Passport)
- Multer (file uploads)
- CORS

### Python Dependencies (Auto-installed)

- google-generativeai (Gemini AI)
- Pillow (image processing)
- requests (API calls)
- python-dotenv (environment variables)
- absl-py (logging)

## 🚨 Troubleshooting

### Python Setup Issues

If Python setup fails:

1. Ensure Python 3.7+ is installed
2. Check pip is available: `python -m pip --version`
3. Run manual setup: `cd python && python setup.py`

### API Key Issues

The meal analyzer uses:

- Gemini AI API (already configured)
- Nutritionix API (already configured)

### Port Issues

- Backend runs on port 4000 by default
- Change via `PORT` environment variable

## 🎯 Usage

1. **Start the backend**: `npm run start:full`
2. **Start the frontend**: `cd ../frontend && npm run dev`
3. **Access SnapMeal**: Navigate to Dashboard → Snap Meal
4. **Upload food image** and get instant nutritional analysis

## 🔒 Security

- JWT token authentication
- Protected API routes
- File upload validation
- CORS configuration
- Input sanitization
