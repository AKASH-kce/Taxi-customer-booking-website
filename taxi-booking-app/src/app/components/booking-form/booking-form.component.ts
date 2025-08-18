import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, VehicleType } from '../../models/booking.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MapService, Location } from '../../services/map.service';
import { BookingService } from '../../services/booking.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  isCalculatingFare = false;
  currentLocation: Location | null = null;
  pickupPredictions: any[] = [];
  dropPredictions: any[] = [];
  estimatedFare: number = 0;
  showFareEstimate = false;
  private destroy$ = new Subject<void>();

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
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      pickupLocation: ['', [Validators.required]],
      dropLocation: ['', [Validators.required]],
      tripType: ['', [Validators.required]],
      tripMode: ['', [Validators.required]],
      vehicleType: ['', [Validators.required]],
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
    this.loadGoogleMaps();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
  }

  private loadGoogleMaps(): void {
    // Load Google Maps script using environment configuration
    this.mapService.loadGoogleMapsScript(environment.googleMapsApiKey)
      .then(() => {
        console.log('Google Maps loaded successfully');
      })
      .catch(error => {
        console.error('Failed to load Google Maps:', error);
      });
  }

  getCurrentLocation(): void {
    this.mapService.getCurrentLocation().subscribe({
      next: (location) => {
        this.currentLocation = location;
        this.bookingForm.patchValue({
          pickupLocation: location.address
        });
        this.calculateFare();
      },
      error: (error) => {
        console.error('Failed to get current location:', error);
        alert('Unable to get your current location. Please enter manually.');
      }
    });
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

    if (pickup && drop && vehicleType && tripType) {
      this.isCalculatingFare = true;
      this.showFareEstimate = false;

      this.bookingService.estimateFare(pickup, drop, vehicleType, tripType).subscribe({
        next: (estimate) => {
          this.estimatedFare = estimate.totalFare;
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

  private calculateSimpleFare(): void {
    const vehicleType = this.vehicleTypes.find(v => v.id === this.bookingForm.get('vehicleType')?.value);
    if (vehicleType) {
      // Simple calculation based on average distance
      this.estimatedFare = vehicleType.baseFare + (vehicleType.perKmRate * 10);
      this.showFareEstimate = true;
    }
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
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: formValue.specialInstructions
      };

      // Simulate API call
      setTimeout(() => {
        this.bookingSubmitted.emit(bookingData);
        this.isLoading = false;
        this.bookingForm.reset();
        this.showFareEstimate = false;
        this.estimatedFare = 0;
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

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
        return `${fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    return '';
  }
}
