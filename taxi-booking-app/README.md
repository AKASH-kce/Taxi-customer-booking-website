# VK Drop Taxi - Professional Taxi Booking Website

A modern, mobile-first taxi booking website built with Angular 20. This application provides a comprehensive solution for taxi booking services with real-time features, fare estimation, and booking management.

## 🚀 Features

### Core Features
- **Real-time Booking System** - Instant taxi booking with live status updates
- **Google Maps Integration** - Pickup and drop location selection with autocomplete
- **Fare Estimator** - Real-time fare calculation based on distance and vehicle type
- **Booking Status Tracking** - Track your booking status in real-time
- **Mobile-First Design** - Responsive design optimized for mobile devices

### Trip Types
- **Local Taxi** - City transportation services
- **Outstation Travel** - Long-distance travel packages
- **Hourly Rental** - Flexible hourly taxi rental
- **Airport Transfer** - Airport pickup and drop services
- **Corporate Travel** - Business travel solutions

### Vehicle Types
- **Sedan** - Comfortable 4-seater vehicles
- **SUV** - Spacious 6-seater vehicles
- **Tempo Traveller** - Large 12-seater vehicles
- **Luxury Cars** - Premium vehicles for special occasions

### Communication Features
- **WhatsApp Integration** - Direct WhatsApp booking and support
- **Click-to-Call** - One-click calling functionality
- **Email Enquiry Form** - Contact form for customer queries
- **Social Media Integration** - Connect on various social platforms

### Additional Features
- **QR Code Generation** - Easy sharing and booking
- **SEO Optimized** - Search engine friendly
- **SSL Certificate Ready** - Secure HTTPS implementation
- **Unlimited Bandwidth** - Scalable hosting ready

## 🛠️ Technology Stack

- **Frontend Framework**: Angular 20
- **UI Framework**: Bootstrap 5.3.2
- **Icons**: Font Awesome 6.5.1
- **Styling**: SCSS with CSS Variables
- **State Management**: Angular Services with RxJS
- **Routing**: Angular Router
- **Forms**: Angular Reactive Forms
- **Build Tool**: Angular CLI

## 📱 Pages & Components

### Main Pages
1. **Home Page** (`/home`) - Main booking form and hero section
2. **Fare Estimator** (`/fare-estimator`) - Calculate fares without booking
3. **Services** (`/services`) - Showcase all taxi services
4. **Packages** (`/packages`) - Tour, hourly, and travel packages
5. **About Us** (`/about`) - Company information and team
6. **Contact** (`/contact`) - Contact information and enquiry form
7. **Booking Status** (`/booking-status`) - Track booking status

### Components
- **Booking Form** - Main taxi booking interface
- **Vehicle Selector** - Choose from available vehicle types
- **Map Picker** - Google Maps integration for location selection
- **Status Tracker** - Real-time booking status updates

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- Angular CLI (v20)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taxi-booking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── booking.model.ts          # Data models and interfaces
│   ├── services/
│   │   ├── booking.service.ts        # Booking management service
│   │   └── maps.service.ts           # Google Maps integration
│   ├── pages/
│   │   ├── home/                     # Home page component
│   │   ├── fare-estimator/           # Fare estimator component
│   │   ├── services/                 # Services showcase
│   │   ├── packages/                 # Travel packages
│   │   ├── about/                    # About us page
│   │   ├── contact/                  # Contact page
│   │   └── booking-status/           # Booking tracking
│   ├── components/                   # Reusable components
│   ├── app.component.ts              # Main app component
│   ├── app.routes.ts                 # Application routing
│   ├── app.config.ts                 # App configuration
│   └── app.scss                      # Global styles
├── assets/                           # Static assets
└── index.html                        # Main HTML file
```

## 🔧 Configuration

### Google Maps API
To enable Google Maps functionality:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Update the API key in `src/app/services/maps.service.ts`
3. Enable required APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API

### WhatsApp Integration
Update WhatsApp numbers in components:
- Main contact: `+919876543210`
- Support: `+919876543210`

### Company Information
Update company details in:
- `src/app/pages/about/about.component.ts`
- `src/app/pages/contact/contact.component.ts`
- `src/app/app.html` (footer)

## 📱 Mobile Optimization

The website is fully optimized for mobile devices with:
- Responsive design using Bootstrap 5
- Touch-friendly interface
- Mobile-first navigation
- Optimized forms for mobile input
- Fast loading times

## 🎨 Customization

### Colors
Update CSS variables in `src/app/app.scss`:
```scss
:root {
  --primary-color: #007bff;
  --secondary-color: #28a745;
  --accent-color: #ffc107;
  // ... more variables
}
```

### Styling
- Global styles: `src/app/app.scss`
- Component-specific styles: Inline styles in components
- Bootstrap customization: Override Bootstrap classes

## 🔒 Security Features

- Form validation and sanitization
- XSS protection
- CSRF protection ready
- Secure routing
- Input validation

## 📊 Performance Optimization

- Lazy loading of components
- Optimized images and assets
- Minified CSS and JavaScript
- Efficient routing
- Service worker ready

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Various Platforms

**Netlify**
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist/taxi-booking-app`

**Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

**Firebase Hosting**
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Initialize: `firebase init hosting`
3. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and queries:
- **Phone**: +91 98765 43210
- **WhatsApp**: +91 98765 43210
- **Email**: info@vkdrop.com

## 🔄 Version History

- **v1.0.0** - Initial release with core booking functionality
- **v1.1.0** - Added fare estimator and booking tracking
- **v1.2.0** - Enhanced mobile responsiveness and UI improvements

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Driver app integration
- [ ] Real-time driver tracking
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**VK Drop Taxi Pvt Ltd** - Your trusted partner for safe and reliable transportation services.
