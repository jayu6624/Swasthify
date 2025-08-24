const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(
    cors({
      origin: "http://localhost:5174",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed'));
    }
});

// Serve static files
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// Route for file upload and analysis
app.post('/analyze', upload.single('foodImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const imagePath = path.join(__dirname, req.file.path);
    console.log('Analyzing image:', imagePath);

    // Call the Python script

    const pythonProcess = spawn('python', ['Final_Working_meal_analyzer.py', imagePath]);
    
    let outputData = '';
    let errorData = '';

    // pythonProcess.stdout.on('data', (data) => {
    //     outputData += data.toString();
    // });

    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString();
      // remove warning lines from result
      //WARNING: All log messages before absl::InitializeLog() is called are written to STDERR
      //E0000 00:00:1741289808.277159   16112 init.cc:232] grpc_wait_for_shutdown_with_timeout() timed out.
      
      console.log(result);
      outputData += result;
    });
    

    // pythonProcess.stderr.on('data', (data) => {
    //     errorData += data.toString();
    //     console.error('Python Error:', data.toString());
    // });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error('Python process exited with code', code);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Error analyzing image',
                pythonError: errorData 
            });
        }

        try {
            // Extract the JSON part from the output
            const jsonStartIndex = outputData.indexOf('{');
            // if (jsonStartIndex === -1) {
            //     throw new Error('Invalid output format from Python script');
            // }
            // console.log("outputData",outputData);
            const jsonString = outputData.substring(jsonStartIndex);
            // console.log("jsonString",jsonString);
            const analysisResult = JSON.parse(jsonString);
            
            res.json(analysisResult);
        } catch (error) {
            console.error('Error parsing Python output:', error);
            res.status(500).json({ 
                status: 'error', 
                message: 'Error parsing analysis results',
                rawOutput: outputData 
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Open this URL in your browser to access the meal analyzer`);
});
