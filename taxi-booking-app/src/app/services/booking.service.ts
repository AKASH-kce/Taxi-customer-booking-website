import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Booking, FareEstimate, VehicleType } from '../models/booking.model';

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

  constructor(private http: HttpClient) {
    this.loadBookingsFromStorage();
  }

  // Create new booking
  createBooking(booking: Omit<Booking, 'id' | 'bookingId' | 'status' | 'createdAt' | 'updatedAt'>): Observable<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: this.generateId(),
      bookingId: this.generateBookingId(),
      status: 'pending',
      createdAt: new Date(),
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

  // Estimate fare
  estimateFare(
    pickup: string,
    drop: string,
    vehicleType: string,
    tripType: 'local' | 'outstation' | 'hourly',
    hours?: number
  ): Observable<FareEstimate> {
    // Mock distance calculation (in real app, use Google Maps API)
    const distance = this.calculateMockDistance(pickup, drop);
    const duration = distance / 30; // Assuming 30 km/h average speed
    
    const vehicle = this.vehicleTypes.find(v => v.type === vehicleType);
    if (!vehicle) {
      throw new Error('Vehicle type not found');
    }

    let totalFare = vehicle.baseFare;
    
    if (tripType === 'hourly' && hours) {
      totalFare += vehicle.perHourRate * hours;
    } else {
      totalFare += vehicle.perKmRate * distance;
    }

    const estimate: FareEstimate = {
      distance: Math.round(distance * 100) / 100,
      duration: Math.round(duration * 100) / 100,
      baseFare: vehicle.baseFare,
      distanceFare: tripType === 'hourly' ? 0 : vehicle.perKmRate * distance,
      timeFare: tripType === 'hourly' ? (hours || 0) * vehicle.perHourRate : 0,
      totalFare: Math.round(totalFare),
      vehicleType: vehicle.name,
      tripType: tripType
    };

    return of(estimate);
  }

  // Get vehicle types
  getVehicleTypes(): Observable<VehicleType[]> {
    return of(this.vehicleTypes);
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

  // Mock distance calculation
  private calculateMockDistance(pickup: string, drop: string): number {
    // In real app, use Google Maps Distance Matrix API
    return Math.random() * 50 + 5; // Random distance between 5-55 km
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

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
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
