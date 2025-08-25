const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Angular build
app.use(express.static(path.join(__dirname, 'dist/taxi-booking-app/browser')));

// API routes (if any) can go here
// Example:
// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello from server!' });
// });

// Handle all other routes and send Angular index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/taxi-booking-app/browser/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
