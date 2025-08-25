const express = require('express');
const path = require('path');
const app = express();

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, 'dist/taxi-booking-app/browser')));

// Redirect all other routes to index.html (for Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/taxi-booking-app/browser/index.html'));
});

// Listen on the Render-assigned port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
