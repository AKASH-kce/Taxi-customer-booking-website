const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from Angular build
app.use(express.static(path.join(__dirname, 'dist/taxi-booking-app/browser')));

// Redirect all routes to index.html (fix refresh 404)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/taxi-booking-app/browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
