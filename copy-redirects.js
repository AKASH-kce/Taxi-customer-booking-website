const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src', '_redirects');
const dest = path.join(__dirname, 'dist', 'taxi-booking-app', 'browser', '_redirects');

fs.copyFileSync(src, dest);
console.log('_redirects copied successfully!');
