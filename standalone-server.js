const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the ContrastKit-Simple.html file
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'ContrastKit-Simple.html');
  
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('ContrastKit-Simple.html not found. Please make sure the file exists in the root directory.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`ContrastKit server running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});