const express = require('express');
const multer = require('multer');
const path = require('path');
const QRCode = require('qrcode'); // Import the QRCode library
const app = express();
const port = 3000;

// Set up Multer storage engine for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Use current timestamp as filename
  },
});

const upload = multer({ storage: storage });

// Middleware to serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Serve static files for frontend (HTML, CSS, JS)
app.use(express.static('public'));

// POST route to handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;

  // Generate QR code for the file URL
  QRCode.toDataURL(fileUrl, (err, qrCodeUrl) => {
    if (err) {
      return res.status(500).send('Error generating QR code.');
    }

    // Send response with the file URL and the QR code image URL
    res.send({
      message: 'File uploaded successfully',
      filePath: fileUrl,
      qrCodeUrl: qrCodeUrl
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`File-sharing app is running at http://localhost:${port}`);
});
