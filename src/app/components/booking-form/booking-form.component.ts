import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, VehicleType } from '../../models/booking.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MapService, Location } from '../../services/map.service';
import { BookingService } from '../../services/booking.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import * as L from 'leaflet';
import { BookingPaymentService } from '../../services/booking-payment.service';
import { MailService } from '../../services/mail-services';

// Google Maps type declarations
declare global {
  namespace google.maps.places {
    interface AutocompletePrediction {
      description: string;
      place_id: string;
      structured_formatting: {
        main_text: string;
        secondary_text: string;
      };
    }
  }
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {
  @Output() bookingSubmitted = new EventEmitter<Booking>();

  bookingForm: FormGroup;
  isLoading = false;
  upiImageURL:string|undefined;
  isCalculatingFare = false;
  currentLocation: Location | null = null;
  pickupPredictions: any[] = [];
  dropPredictions: any[] = [];
  estimatedFare: number = 0;
  showFareEstimate = false;
  private destroy$ = new Subject<void>();
  // Map pickers
  showPickupMap = false;
  showDropMap = false;
  private pickupLeafletMap: L.Map | null = null;
  private dropLeafletMap: L.Map | null = null;

  vehicleTypes: VehicleType[] = [
    {
      id: 'hatchback',
      name: 'Hatchback',
      type: 'sedan',
      baseFare: 10,
      perKmRate: 12,
      perHourRate: 100,
      capacity: 4,
      image: '',
      description: 'Economical hatchback for city travel',
      features: ['AC', 'Music System', 'GPS']
    },
    {
      id: 'sedan',
      name: 'Sedan',
      type: 'sedan',
      baseFare: 15,
      perKmRate: 15,
      perHourRate: 120,
      capacity: 4,
      image: '',
      description: 'Comfortable sedan for business travel',
      features: ['AC', 'Music System', 'GPS', 'Leather Seats']
    },
    {
      id: 'suv',
      name: 'SUV',
      type: 'suv',
      baseFare: 20,
      perKmRate: 18,
      perHourRate: 150,
      capacity: 6,
      image: '',
      description: 'Spacious SUV for family travel',
      features: ['AC', 'Music System', 'GPS', 'Extra Space']
    },
    {
      id: 'luxury',
      name: 'Luxury',
      type: 'luxury',
      baseFare: 30,
      perKmRate: 25,
      perHourRate: 200,
      capacity: 4,
      image: '',
      description: 'Premium luxury vehicle for special occasions',
      features: ['AC', 'Music System', 'GPS', 'Premium Interior', 'Chauffeur']
    }
  ];

  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    private bookingService: BookingService,
    private bookingPaymentservice:BookingPaymentService,
    private mailService: MailService
  ) {
    this.bookingForm = this.fb.group({
      pickupLocation: ['', [Validators.required]],
      dropLocation: ['', [Validators.required]],
      tripType: ['', [Validators.required]],
      tripMode: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
      pickupDistance: ['', [Validators.required, Validators.min(0.1)]],
      pickupDate: ['', [Validators.required]],
      pickupTime: ['', [Validators.required]],
      passengerName: ['', [Validators.required]],
      passengerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      passengerEmail: ['', [Validators.required, Validators.email]],
      specialInstructions: ['']
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
    this.setupCurrentLocationListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private setupCurrentLocationListener(): void {
    this.bookingForm.get('pickupLocation')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value === 'CURRENT_LOCATION' && this.currentLocation) {
          this.bookingForm.patchValue({
            pickupLocation: this.currentLocation.address
          });
          this.calculateFare();
        }
      });
  }

  private setupFormListeners(): void {
    // Listen for pickup location changes
    this.bookingForm.get('pickupLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.getPlacePredictions(value, 'pickup');
        } else {
          this.pickupPredictions = [];
        }
      });

    // Listen for drop location changes
    this.bookingForm.get('dropLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.getPlacePredictions(value, 'drop');
        } else {
          this.dropPredictions = [];
        }
      });

    // Listen for fare calculation triggers
    this.bookingForm.get('pickupLocation')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateFare());

    this.bookingForm.get('dropLocation')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateFare());

    this.bookingForm.get('vehicleType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateFare());

    this.bookingForm.get('tripType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateFare());

    this.bookingForm.get('pickupDistance')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.calculateFare())
  }

  getCurrentLocation(): void {
    this.mapService.getCurrentLocation().subscribe({
      next: (location) => {
        this.currentLocation = location;
        this.bookingForm.patchValue({
          pickupLocation: 'CURRENT_LOCATION'
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to get current location:', error);
        alert('Unable to get your current location. Please enter manually.');
      }
    });
  }

  togglePickupMap(): void {
    this.showPickupMap = !this.showPickupMap;
    setTimeout(() => {
      if (this.showPickupMap && !this.pickupLeafletMap) {
        this.pickupLeafletMap = this.initLeafletMap('pickupMapContainer', (lat, lng) => {
          this.mapService.reverseGeocode(lat, lng).subscribe({
            next: addr => {
              this.bookingForm.patchValue({ pickupLocation: addr });
              this.calculateFare();
            },
            error: () => {
              this.bookingForm.patchValue({ pickupLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
              this.calculateFare();
            }
          });
        });
      }
      if (this.pickupLeafletMap) {
        this.pickupLeafletMap.invalidateSize();
      }
    });
  }

  toggleDropMap(): void {
    this.showDropMap = !this.showDropMap;
    setTimeout(() => {
      if (this.showDropMap && !this.dropLeafletMap) {
        this.dropLeafletMap = this.initLeafletMap('dropMapContainer', (lat, lng) => {
          this.mapService.reverseGeocode(lat, lng).subscribe({
            next: addr => {
              this.bookingForm.patchValue({ dropLocation: addr });
              this.calculateFare();
            },
            error: () => {
              this.bookingForm.patchValue({ dropLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
              this.calculateFare();
            }
          });
        });
      }
      if (this.dropLeafletMap) {
        this.dropLeafletMap.invalidateSize();
      }
    });
  }

  private initLeafletMap(containerId: string, onPick: (lat: number, lng: number) => void): L.Map {
    const map = L.map(containerId).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    let marker: L.CircleMarker | null = null;
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();
      marker = L.circleMarker([lat, lng], { radius: 8, color: '#007bff', fillColor: '#007bff', fillOpacity: 0.6 }).addTo(map);
      onPick(lat, lng);
    });
    return map;
  }

  private getPlacePredictions(input: string, type: 'pickup' | 'drop'): void {
    this.mapService.getPlacePredictions(input).subscribe({
      next: (predictions) => {
        if (type === 'pickup') {
          this.pickupPredictions = predictions;
        } else {
          this.dropPredictions = predictions;
        }
      },
      error: (error) => {
        console.error('Failed to get place predictions:', error);
      }
    });
  }

  selectPlacePrediction(prediction: any, type: 'pickup' | 'drop'): void {
    if (type === 'pickup') {
      this.bookingForm.patchValue({ pickupLocation: prediction.description });
      this.pickupPredictions = [];
    } else {
      this.bookingForm.patchValue({ dropLocation: prediction.description });
      this.dropPredictions = [];
    }
    this.calculateFare();
  }

  private calculateFare(): void {
    const pickup = this.bookingForm.get('pickupLocation')?.value;
    const drop = this.bookingForm.get('dropLocation')?.value;
    const vehicleType = this.bookingForm.get('vehicleType')?.value;
    const tripType = this.bookingForm.get('tripType')?.value;
    const distance = parseFloat(this.bookingForm.get('pickupDistance')?.value);
    // If distance is provided, use it for calculation
    if (distance && distance > 0 && vehicleType) {
      this.calculateFareByDistance(distance, vehicleType);
      return;
    }
    if (pickup && drop && vehicleType && tripType) {
      this.isCalculatingFare = true;
      this.showFareEstimate = false;

      this.bookingService.estimateFare(pickup, drop, vehicleType, tripType).subscribe({
        next: (estimate) => {
          this.estimatedFare = estimate.totalFare;
          this.bookingForm.patchValue({
            pickupDistance: estimate.distance.toFixed(2)
          });
          this.showFareEstimate = true;
          this.isCalculatingFare = false;
        },
        error: (error) => {
          console.error('Failed to calculate fare:', error);
          this.isCalculatingFare = false;
          // Fallback to simple calculation
          this.calculateSimpleFare();
        }
      });
    }
  }

  // Add this new method for distance-based calculation
  calculateFareByDistance(distance: number, vehicleTypeId: string): void {
    this.isCalculatingFare = true;
    const vehicle = this.vehicleTypes.find(v => v.id === vehicleTypeId);

    if (vehicle) {
      // Simple fare = base fare + (distance * per km rate)
      this.estimatedFare = vehicle.baseFare + (distance * vehicle.perKmRate);
      this.showFareEstimate = true;
    } else {
      this.estimatedFare = 0;
      this.showFareEstimate = false;
    }

    this.isCalculatingFare = false;
  }


  private calculateSimpleFare(): void {
    const vehicleType = this.vehicleTypes.find(v => v.id === this.bookingForm.get('vehicleType')?.value);
    if (vehicleType) {
      // Simple calculation based on average distance
      this.estimatedFare = vehicleType.baseFare + (vehicleType.perKmRate * 10);
      this.showFareEstimate = true;
    }
  }

//   onSubmit() {
//     if (this.bookingForm.valid) {
//       this.isLoading = true;

//       const formValue = this.bookingForm.value;
//       const bookingData: Booking = {
//         id: this.generateBookingId(),
//         bookingId: this.generateBookingId(),
//         customerName: formValue.passengerName,
//         customerPhone: formValue.passengerPhone,
//         customerEmail: formValue.passengerEmail,
//         pickupLocation: formValue.pickupLocation,
//         dropLocation: formValue.dropLocation,
//         tripType: formValue.tripType,
//         tripMode: formValue.tripMode,
//         vehicleType: formValue.vehicleType,
//         date: formValue.pickupDate,
//         time: formValue.pickupTime,
//         estimatedFare: this.estimatedFare || this.calculateEstimatedFare(),
//         status: 'pending',
//         bookingDate: new Date(),
//         paymentStatus: 'pending',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         notes: formValue.specialInstructions
//       };
// //  this.bookingSubmitted.emit(bookingData);
//       // Simulate API call
//       setTimeout(() => {
       
//         this.isLoading = false;
//         this.bookingForm.reset();
//         this.showFareEstimate = false;
//         this.estimatedFare = 0;
//       }, 2000);
//     } else {
//       this.markFormGroupTouched();
//     }
//   }

  private generateBookingId(): string {
    return 'BK' + Date.now().toString().slice(-8);
  }

  private calculateEstimatedFare(): number {
    const vehicleType = this.vehicleTypes.find(v => v.id === this.bookingForm.get('vehicleType')?.value);
    if (!vehicleType) return 0;

    return vehicleType.baseFare + (vehicleType.perKmRate * 10);
  }

  private markFormGroupTouched() {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit phone number';
      }
      if (field.errors['min']) {
        return 'Distance must be greater than 0';
      }
    }
    return '';
  }
  private formatFieldName(name: string): string {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

showUPIQRCode(link: string) {
  this.upiImageURL="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="+link;
}

showQRPopup = false;
currentBookingId = '';
currentBookingData: Booking | null = null;


payWithUPI() {
  if (this.bookingForm.invalid) {
    this.markFormGroupTouched();
    return;
  }

  this.isLoading = true;
  this.currentBookingId = this.generateBookingId();

  const formValue = this.bookingForm.value;
  this.currentBookingData = {
    id: this.currentBookingId,
    bookingId: this.currentBookingId,
    customerName: formValue.passengerName,
    customerPhone: formValue.passengerPhone,
    customerEmail: formValue.passengerEmail,
    pickupLocation: formValue.pickupLocation,
    dropLocation: formValue.dropLocation,
    tripType: formValue.tripType,
    tripMode: formValue.tripMode,
    vehicleType: formValue.vehicleType,
    date: formValue.pickupDate,
    time: formValue.pickupTime,
    estimatedFare: this.estimatedFare || this.calculateEstimatedFare(),
    status: 'pending',
    bookingDate: new Date(),
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: formValue.specialInstructions
  };

  // Generate UPI link and QR code
  const upiLink = this.bookingPaymentservice.getUPILink(
    this.currentBookingId, 
    this.currentBookingData.estimatedFare
  );
  
  this.showUPIQRCode(upiLink);
  
  setTimeout(() => {
    this.showQRPopup = true;
    this.isLoading = false;
  }, 300);
}

closeQRPopup() {
  this.showQRPopup = false;
  this.currentBookingData = null;
}

onSubmit() {
  if (this.bookingForm.valid) {
    this.isLoading = true;

    const formValue = this.bookingForm.value;
    const bookingData: Booking = {
      id: this.generateBookingId(),
      bookingId: this.generateBookingId(),
      customerName: formValue.passengerName,
      customerPhone: formValue.passengerPhone,
      customerEmail: formValue.passengerEmail,
      pickupLocation: formValue.pickupLocation,
      dropLocation: formValue.dropLocation,
      tripType: formValue.tripType,
      tripMode: formValue.tripMode,
      vehicleType: formValue.vehicleType,
      date: formValue.pickupDate,
      time: formValue.pickupTime,
      estimatedFare: this.estimatedFare || this.calculateEstimatedFare(),
      status: 'pending',
      bookingDate: new Date(),
      paymentStatus: 'pending',   // always pending for Book Now
      paymentMethod: 'cash',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: formValue.specialInstructions
    };

    // ✅ Send booking data to backend via MailService
    this.mailService.sendBookingEmail(bookingData).subscribe({
      next: () => {
        this.isLoading = false;
        this.bookingForm.reset();
        this.showFareEstimate = false;
        this.estimatedFare = 0;
        alert(`Booking successful! Confirmation email sent to ${bookingData.customerEmail}`);
      },
      error: (err) => {
        this.isLoading = false;
        alert('Booking saved but email failed: ' + err.message);
      }
    });
  } else {
    this.markFormGroupTouched();
  }
}


confirmPayment() {
  if (!this.currentBookingData) return;

  this.isLoading = true;

  this.currentBookingData.paymentStatus = 'paid';
  this.currentBookingData.paymentMethod = 'upi';

  // ✅ Send paid booking data to backend
  this.mailService.sendBookingEmail(this.currentBookingData).subscribe({
    next: () => {
      this.showQRPopup = false;
      this.isLoading = false;
      this.bookingForm.reset();
      this.showFareEstimate = false;
      this.estimatedFare = 0;
      alert(`Payment successful! Confirmation email sent to ${this.currentBookingData?.customerEmail}`);
      this.currentBookingData = null;
    },
    error: (err) => {
      this.isLoading = false;
      alert('Payment confirmed but email failed: ' + err.message);
    }
  });
}

}