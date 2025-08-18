# VK Drop Taxi Booking Website

A modern, responsive taxi booking website built with Angular 17, featuring real-time map integration, location services, and accurate fare calculation.

## 🚀 Features

### ✨ Core Features
- **Real-time Map Integration**: Google Maps API integration for accurate location services
- **Location Access**: Get current location with browser geolocation
- **Address Autocomplete**: Smart address suggestions powered by Google Places API
- **Real-time Fare Calculation**: Accurate fare estimation based on actual route distance
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI/UX**: Beautiful, intuitive interface with smooth animations

### 🗺️ Map Features
- **Current Location Detection**: One-click pickup location detection
- **Address Geocoding**: Convert addresses to coordinates and vice versa
- **Route Optimization**: Get optimal routes with real traffic data
- **Distance Calculation**: Accurate distance calculation using Google Maps API
- **Place Autocomplete**: Smart address suggestions as you type

### 💰 Fare Calculation
- **Real-time Pricing**: Dynamic fare calculation based on actual distance
- **Multiple Vehicle Types**: Different pricing for hatchback, sedan, SUV, and luxury
- **Additional Charges**: Night charges, toll fees, and waiting time
- **Trip Types**: Local, outstation, and hourly rental options
- **Transparent Pricing**: Detailed fare breakdown with all charges

### 📱 Booking Features
- **Easy Booking Form**: Streamlined booking process with validation
- **Real-time Updates**: Live fare updates as you change locations
- **Booking Status Tracking**: Track your booking status in real-time
- **WhatsApp Integration**: Direct WhatsApp booking option
- **Email Notifications**: Booking confirmations and updates

## 🛠️ Technology Stack

- **Frontend**: Angular 17 (Standalone Components)
- **Styling**: SCSS with Bootstrap 5
- **Maps**: Google Maps JavaScript API
- **Icons**: FontAwesome
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v18 or higher)
2. **npm** (v9 or higher)
3. **Google Maps API Key** (see setup instructions below)

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taxi-booking-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Google Maps API Setup

#### Step 1: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

#### Step 2: Configure API Key
1. Open `src/environments/environment.ts`
2. Replace `'YOUR_GOOGLE_MAPS_API_KEY'` with your actual API key:

```typescript
export const environment = {
  production: false,
  googleMapsApiKey: 'your-actual-api-key-here'
};
```

### 4. Run the Application
```bash
npm start
```

The application will be available at `http://localhost:4200`

## 🗺️ Map Integration Details

### Services Used
- **Geocoding API**: Convert addresses to coordinates
- **Places API**: Address autocomplete and place details
- **Directions API**: Route calculation and distance estimation
- **Maps JavaScript API**: Interactive maps and location services

### Features Implemented
1. **Current Location Detection**
   - Uses browser's Geolocation API
   - Reverse geocoding to get address
   - Fallback to coordinates if geocoding fails

2. **Address Autocomplete**
   - Real-time address suggestions
   - Restricted to India for better results
   - Structured formatting for better UX

3. **Route Calculation**
   - Real-time route optimization
   - Distance and duration calculation
   - Traffic-aware routing

4. **Fare Calculation**
   - Base fare + distance-based pricing
   - Additional charges (night, toll, waiting)
   - Real-time updates

## 📱 Usage Guide

### Booking a Taxi
1. **Enter Pickup Location**
   - Type address or click location button
   - Select from autocomplete suggestions
   - Use current location for instant pickup

2. **Enter Drop Location**
   - Type destination address
   - Select from autocomplete suggestions
   - View real-time fare estimate

3. **Select Vehicle & Trip Type**
   - Choose from available vehicle types
   - Select trip type (local/outstation/hourly)
   - View updated fare estimate

4. **Complete Booking**
   - Fill in passenger details
   - Review fare breakdown
   - Submit booking

### Fare Estimation
1. **Real-time Calculation**
   - Fare updates as you change locations
   - Accurate distance-based pricing
   - Transparent charge breakdown

2. **Additional Charges**
   - Night charges (10 PM - 6 AM)
   - Toll charges for outstation trips
   - Waiting time charges

## 🔒 Security Considerations

1. **API Key Security**
   - Restrict API key to your domain
   - Enable billing alerts
   - Monitor API usage

2. **Location Privacy**
   - User consent for location access
   - Secure handling of location data
   - Privacy policy compliance

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
For production deployment, update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  googleMapsApiKey: 'your-production-api-key'
};
```

## 📊 Performance Optimization

1. **Lazy Loading**: Components loaded on demand
2. **Image Optimization**: Compressed images and icons
3. **Code Splitting**: Automatic code splitting by Angular
4. **Caching**: Browser caching for static assets

## 🐛 Troubleshooting

### Common Issues

1. **Google Maps Not Loading**
   - Check API key configuration
   - Verify API is enabled in Google Cloud Console
   - Check browser console for errors

2. **Location Access Denied**
   - Ensure HTTPS for production
   - Check browser permissions
   - Provide fallback manual entry

3. **Fare Calculation Errors**
   - Verify both locations are entered
   - Check internet connection
   - Fallback to simple calculation

### Debug Mode
Enable debug logging by setting:
```typescript
// In map.service.ts
console.log('Google Maps loaded successfully');
```

## 📞 Support

For technical support or questions:
- **WhatsApp**: +91 6374252235
- **Email**: info@vkdrop.com
- **Website**: [VK Drop Taxi](https://vkdrop.com)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📈 Future Enhancements

- [ ] Real-time driver tracking
- [ ] Payment gateway integration
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Driver app integration

---

**Built with ❤️ by VK Drop Taxi Team**
