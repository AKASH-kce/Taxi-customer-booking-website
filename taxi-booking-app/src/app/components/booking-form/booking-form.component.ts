import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Booking, VehicleType } from '../../models/booking.model';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent {
  @Output() bookingSubmitted = new EventEmitter<Booking>();
  
  bookingForm: FormGroup;
  isLoading = false;
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

  constructor(private fb: FormBuilder) {
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

  onSubmit() {
    if (this.bookingForm.valid) {
      this.isLoading = true;
      
      const bookingData: Booking = {
        id: this.generateBookingId(),
        ...this.bookingForm.value,
        status: 'pending',
        createdAt: new Date(),
        estimatedFare: this.calculateEstimatedFare()
      };

      // Simulate API call
      setTimeout(() => {
        this.bookingSubmitted.emit(bookingData);
        this.isLoading = false;
        this.bookingForm.reset();
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
    
    // Simple fare calculation (you can make this more sophisticated)
    return vehicleType.baseFare + (vehicleType.perKmRate * 10); // Assuming 10km average
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
