// Upload routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { saveFile } = require('../config/upload');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only specific document types
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      return cb(null, true);
    }
    
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// Upload CV endpoint
router.post('/cv', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Save file to local filesystem
    const fileInfo = await saveFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.status(200).json({
      message: 'File uploaded successfully',
      file_id: fileInfo.filename,
      file_url: fileInfo.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 