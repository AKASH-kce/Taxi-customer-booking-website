import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Booking, FareEstimate, VehicleType } from '../models/booking.model';
import { MapService, Location, RouteInfo } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://your-api-endpoint.com/api'; // Replace with your actual API
  private bookings: Booking[] = [];
  private vehicleTypes: VehicleType[] = [
    {
      id: '1',
      name: 'Sedan',
      type: 'sedan',
      baseFare: 50,
      perKmRate: 12,
      perHourRate: 200,
      capacity: 4,
      image: 'assets/images/sedan.jpg',
      description: 'Comfortable sedan for city travel',
      features: ['AC', 'Music', 'Clean Interior', 'Professional Driver']
    },
    {
      id: '2',
      name: 'SUV',
      type: 'suv',
      baseFare: 80,
      perKmRate: 15,
      perHourRate: 250,
      capacity: 6,
      image: 'assets/images/suv.jpg',
      description: 'Spacious SUV for family travel',
      features: ['AC', 'Music', 'Clean Interior', 'Professional Driver', 'Extra Space']
    },
    {
      id: '3',
      name: 'Tempo Traveller',
      type: 'tempo',
      baseFare: 120,
      perKmRate: 18,
      perHourRate: 300,
      capacity: 12,
      image: 'assets/images/tempo.jpg',
      description: 'Large vehicle for group travel',
      features: ['AC', 'Music', 'Clean Interior', 'Professional Driver', 'Group Travel']
    },
    {
      id: '4',
      name: 'Luxury Car',
      type: 'luxury',
      baseFare: 150,
      perKmRate: 25,
      perHourRate: 400,
      capacity: 4,
      image: 'assets/images/luxury.jpg',
      description: 'Premium luxury vehicle',
      features: ['AC', 'Music', 'Clean Interior', 'Professional Driver', 'Premium Service']
    }
  ];

  constructor(
    private http: HttpClient,
    private mapService: MapService
  ) {
    this.loadBookingsFromStorage();
  }

  // Create new booking
  createBooking(booking: Booking): Observable<Booking> {
    // Ensure the booking has all required fields
    const newBooking: Booking = {
      ...booking,
      id: booking.id || this.generateId(),
      bookingId: booking.bookingId || this.generateBookingId(),
      status: booking.status || 'pending',
      createdAt: booking.createdAt || new Date(),
      updatedAt: new Date()
    };

    this.bookings.push(newBooking);
    this.saveBookingsToStorage();
    
    // Send WhatsApp notification
    this.sendWhatsAppNotification(newBooking);
    
    return of(newBooking);
  }

  // Get booking by ID
  getBookingById(bookingId: string): Observable<Booking | null> {
    const booking = this.bookings.find(b => b.bookingId === bookingId);
    return of(booking || null);
  }

  // Get booking by phone number
  getBookingsByPhone(phone: string): Observable<Booking[]> {
    const bookings = this.bookings.filter(b => b.customerPhone === phone);
    return of(bookings);
  }

  // Update booking status
  updateBookingStatus(bookingId: string, status: Booking['status']): Observable<Booking | null> {
    const booking = this.bookings.find(b => b.bookingId === bookingId);
    if (booking) {
      booking.status = status;
      booking.updatedAt = new Date();
      this.saveBookingsToStorage();
      return of(booking);
    }
    return of(null);
  }

  // Estimate fare with real map data
  estimateFare(
    pickup: string,
    drop: string,
    vehicleType: string,
    tripType: 'local' | 'outstation' | 'hourly',
    hours?: number
  ): Observable<FareEstimate> {
    return new Observable(observer => {
      // First geocode both addresses
      this.mapService.geocodeAddress(pickup).subscribe({
        next: (originLocation) => {
          this.mapService.geocodeAddress(drop).subscribe({
            next: (destinationLocation) => {
              // Get route information
              this.mapService.getRouteInfo(originLocation, destinationLocation).subscribe({
                next: (routeInfo) => {
                  const vehicle = this.vehicleTypes.find(v => v.type === vehicleType);
                  if (!vehicle) {
                    observer.error('Vehicle type not found');
                    return;
                  }

                  let totalFare = vehicle.baseFare;
                  let distanceFare = 0;
                  let timeFare = 0;

                  if (tripType === 'hourly' && hours) {
                    timeFare = vehicle.perHourRate * hours;
                    totalFare += timeFare;
                  } else {
                    distanceFare = vehicle.perKmRate * routeInfo.distance;
                    totalFare += distanceFare;
                  }

                  // Add additional charges
                  const tollCharges = this.calculateTollCharges(routeInfo.distance, tripType);
                  const nightCharges = this.calculateNightCharges();
                  const waitingCharges = this.calculateWaitingCharges(routeInfo.duration);

                  totalFare += tollCharges + nightCharges + waitingCharges;

                  const estimate: FareEstimate = {
                    distance: Math.round(routeInfo.distance * 100) / 100,
                    duration: Math.round(routeInfo.duration * 100) / 100,
                    baseFare: vehicle.baseFare,
                    distanceFare: Math.round(distanceFare),
                    timeFare: Math.round(timeFare),
                    totalFare: Math.round(totalFare),
                    vehicleType: vehicle.name,
                    tripType: tripType
                  };

                  observer.next(estimate);
                  observer.complete();
                },
                error: (error) => {
                  // Fallback to simple calculation if route service fails
                  const fallbackDistance = this.mapService.calculateDistance(
                    originLocation.lat, originLocation.lng,
                    destinationLocation.lat, destinationLocation.lng
                  );
                  
                  const vehicle = this.vehicleTypes.find(v => v.type === vehicleType);
                  if (!vehicle) {
                    observer.error('Vehicle type not found');
                    return;
                  }

                  let totalFare = vehicle.baseFare;
                  let distanceFare = 0;
                  let timeFare = 0;

                  if (tripType === 'hourly' && hours) {
                    timeFare = vehicle.perHourRate * hours;
                    totalFare += timeFare;
                  } else {
                    distanceFare = vehicle.perKmRate * fallbackDistance;
                    totalFare += distanceFare;
                  }

                  const estimate: FareEstimate = {
                    distance: Math.round(fallbackDistance * 100) / 100,
                    duration: Math.round((fallbackDistance / 30) * 60 * 100) / 100, // Assuming 30 km/h
                    baseFare: vehicle.baseFare,
                    distanceFare: Math.round(distanceFare),
                    timeFare: Math.round(timeFare),
                    totalFare: Math.round(totalFare),
                    vehicleType: vehicle.name,
                    tripType: tripType
                  };

                  observer.next(estimate);
                  observer.complete();
                }
              });
            },
            error: (error) => {
              observer.error('Failed to geocode destination: ' + error);
            }
          });
        },
        error: (error) => {
          observer.error('Failed to geocode origin: ' + error);
        }
      });
    });
  }

  // Get current location and estimate fare
  estimateFareFromCurrentLocation(
    drop: string,
    vehicleType: string,
    tripType: 'local' | 'outstation' | 'hourly',
    hours?: number
  ): Observable<FareEstimate> {
    return new Observable(observer => {
      this.mapService.getCurrentLocation().subscribe({
        next: (currentLocation) => {
          this.mapService.geocodeAddress(drop).subscribe({
            next: (destinationLocation) => {
              this.mapService.getRouteInfo(currentLocation, destinationLocation).subscribe({
                next: (routeInfo) => {
                  const vehicle = this.vehicleTypes.find(v => v.type === vehicleType);
                  if (!vehicle) {
                    observer.error('Vehicle type not found');
                    return;
                  }

                  let totalFare = vehicle.baseFare;
                  let distanceFare = 0;
                  let timeFare = 0;

                  if (tripType === 'hourly' && hours) {
                    timeFare = vehicle.perHourRate * hours;
                    totalFare += timeFare;
                  } else {
                    distanceFare = vehicle.perKmRate * routeInfo.distance;
                    totalFare += distanceFare;
                  }

                  const estimate: FareEstimate = {
                    distance: Math.round(routeInfo.distance * 100) / 100,
                    duration: Math.round(routeInfo.duration * 100) / 100,
                    baseFare: vehicle.baseFare,
                    distanceFare: Math.round(distanceFare),
                    timeFare: Math.round(timeFare),
                    totalFare: Math.round(totalFare),
                    vehicleType: vehicle.name,
                    tripType: tripType
                  };

                  observer.next(estimate);
                  observer.complete();
                },
                error: (error) => {
                  observer.error('Failed to get route: ' + error);
                }
              });
            },
            error: (error) => {
              observer.error('Failed to geocode destination: ' + error);
            }
          });
        },
        error: (error) => {
          observer.error('Failed to get current location: ' + error);
        }
      });
    });
  }

  // Get vehicle types
  getVehicleTypes(): Observable<VehicleType[]> {
    return of(this.vehicleTypes);
  }

  // Calculate toll charges based on distance and trip type
  private calculateTollCharges(distance: number, tripType: string): number {
    if (tripType === 'outstation' && distance > 100) {
      // ₹50 per 50km for outstation trips
      return Math.floor(distance / 50) * 50;
    }
    return 0;
  }

  // Calculate night charges (10 PM to 6 AM)
  private calculateNightCharges(): number {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 6) {
      return 50; // Night charges
    }
    return 0;
  }

  // Calculate waiting charges based on duration
  private calculateWaitingCharges(durationMinutes: number): number {
    // ₹10 per 15 minutes of waiting time
    return Math.floor(durationMinutes / 15) * 10;
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate booking ID
  private generateBookingId(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VK${year}${month}${day}${random}`;
  }

  // Send WhatsApp notification
  private sendWhatsAppNotification(booking: Booking): void {
    const message = `New booking received!
Booking ID: ${booking.bookingId}
Customer: ${booking.customerName}
Phone: ${booking.customerPhone}
From: ${booking.pickupLocation}
To: ${booking.dropLocation}
Date: ${booking.date}
Time: ${booking.time}
Vehicle: ${booking.vehicleType}
Estimated Fare: ₹${booking.estimatedFare}`;

    const whatsappUrl = `https://wa.me/6374252235?text=${encodeURIComponent(message)}`;
    // In real app, send this to your backend API
    console.log('WhatsApp notification:', whatsappUrl);
  }

  // Local storage methods
  private saveBookingsToStorage(): void {
    localStorage.setItem('bookings', JSON.stringify(this.bookings));
  }

  private loadBookingsFromStorage(): void {
    const stored = localStorage.getItem('bookings');
    if (stored) {
      this.bookings = JSON.parse(stored);
    }
  }
}
