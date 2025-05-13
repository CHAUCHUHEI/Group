const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Function to save file to local filesystem
const saveFile = async (fileBuffer, originalFilename, fileType) => {
  try {
    // Generate unique filename with original extension
    const fileExtension = path.extname(originalFilename);
    const filename = `cv_${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);
    
    // Write file to disk
    fs.writeFileSync(filePath, fileBuffer);
    
    // Return the relative path to the file
    return {
      filename,
      path: `/uploads/${filename}`,
      fullPath: filePath
    };
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
};

// Function to delete file from filesystem
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

module.exports = {
  uploadDir,
  saveFile,
  deleteFile
}; 