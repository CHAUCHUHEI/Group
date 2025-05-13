const express = require('express');
const router = express.Router();
const { upload, handleFileUploadError } = require('../middleware/fileValidation');
const { authenticateUser } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists with proper permissions
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { mode: 0o755 });
}

// CV upload endpoint with authentication
router.post('/upload', 
    authenticateUser, // Authentication middleware
    upload.single('cv'), // File upload middleware
    handleFileUploadError, // Error handling middleware
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Get user ID from authenticated request
            const userId = req.user.id;

            // Here you would typically save the file reference to your database
            // const fileRecord = await File.create({
            //     userId: userId,
            //     filename: req.file.filename,
            //     originalName: req.file.originalname,
            //     mimeType: req.file.mimetype,
            //     size: req.file.size
            // });

            res.status(200).json({
                message: 'File uploaded successfully',
                file: {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    size: req.file.size
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Error uploading file' });
        }
    }
);

// Get CV file endpoint (protected)
router.get('/:filename', authenticateUser, (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    // Send file
    res.sendFile(filepath);
});

module.exports = router; 