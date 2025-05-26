const multer = require("multer"); // Middleware for handling multipart/form-data, which is used for uploading files
const path = require("path"); // Node.js path module for working with file and directory paths

// Configure storage
const storage = multer.diskStorage({
  // Storage engine for multer
  destination: function (req, file, cb) {
    // Destination folder for uploaded files
    cb(null, "uploads/technical_sheets/"); // Ensure this folder exists or create it
  },
  filename: function (req, file, cb) {
    // Filename for the uploaded file
    // Generate a unique filename to avoid conflicts

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Unique suffix based on timestamp and random number
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // Use the original file extension
  },
});
// Configure file filter
// This function checks the file type and size before uploading
const fileFilter = (req, file, cb) => {
  // File filter function
  const allowedTypes = [".xlsx", ".xls", ".docx"]; // Allowed file types
  const ext = path.extname(file.originalname).toLowerCase(); // Get the file extension and convert it to lowercase
  if (allowedTypes.includes(ext)) {
    // Check if the file type is allowed
    cb(null, true); // Allow the file upload
  } else {
    cb(new Error("Only Excel or Word files are allowed")); // Reject the file upload with an error message
  }
};
// Configure multer
// This middleware handles the file upload process
const upload = multer({
  // Multer configuration
  storage, // Storage engine
  fileFilter, // File filter function
  // Limits for file size and other options
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
});

module.exports = upload;
