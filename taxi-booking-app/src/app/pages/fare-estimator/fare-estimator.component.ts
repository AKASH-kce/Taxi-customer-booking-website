import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { FareEstimate, VehicleType } from '../../models/booking.model';

@Component({
  selector: 'app-fare-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>Fare Estimator</h1>
            <p>Get instant fare estimates for your journey</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Fare Estimator Form -->
    <section class="estimator-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-body p-4">
                <h3 class="text-center mb-4">Calculate Your Fare</h3>
                
                <form [formGroup]="estimatorForm" (ngSubmit)="calculateFare()">
                  <div class="row">
                    <!-- From Location -->
                    <div class="col-md-6 mb-3">
                      <label class="form-label">From *</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                        <input 
                          type="text" 
                          class="form-control" 
                          formControlName="fromLocation"
                          placeholder="Enter pickup location"
                        >
                      </div>
                    </div>

                    <!-- To Location -->
                    <div class="col-md-6 mb-3">
                      <label class="form-label">To *</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="fas fa-map-marker-alt"></i></span>
                        <input 
                          type="text" 
                          class="form-control" 
                          formControlName="toLocation"
                          placeholder="Enter drop location"
                        >
                      </div>
                    </div>

                    <!-- Trip Type -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Trip Type *</label>
                      <select class="form-select" formControlName="tripType">
                        <option value="">Select Type</option>
                        <option value="local">Local</option>
                        <option value="outstation">Out Station</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>

                    <!-- Vehicle Type -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Vehicle Type *</label>
                      <select class="form-select" formControlName="vehicleType">
                        <option value="">Select Vehicle</option>
                        <option *ngFor="let vehicle of vehicleTypes" [value]="vehicle.type">
                          {{ vehicle.name }}
                        </option>
                      </select>
                    </div>

                    <!-- Hours (for hourly trips) -->
                    <div class="col-md-4 mb-3" *ngIf="estimatorForm.get('tripType')?.value === 'hourly'">
                      <label class="form-label">Hours *</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        formControlName="hours"
                        min="1"
                        max="24"
                        placeholder="Enter hours"
                      >
                    </div>

                    <!-- Calculate Button -->
                    <div class="col-12 text-center">
                      <button 
                        type="submit" 
                        class="btn btn-primary btn-lg"
                        [disabled]="estimatorForm.invalid || isCalculating"
                      >
                        <span *ngIf="isCalculating" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isCalculating ? 'Calculating...' : 'Calculate Fare' }}
                      </button>
                    </div>
                  </div>
                </form>

                <!-- Fare Result -->
                <div *ngIf="fareEstimate" class="mt-4">
                  <div class="alert alert-success">
                    <h4 class="alert-heading">Estimated Fare: ₹{{ fareEstimate.totalFare }}</h4>
                    <hr>
                    <div class="row">
                      <div class="col-md-6">
                        <p><strong>Distance:</strong> {{ fareEstimate.distance }} km</p>
                        <p><strong>Duration:</strong> {{ fareEstimate.duration }} hours</p>
                        <p><strong>Vehicle:</strong> {{ fareEstimate.vehicleType }}</p>
                      </div>
                      <div class="col-md-6">
                        <p><strong>Base Fare:</strong> ₹{{ fareEstimate.baseFare }}</p>
                        <p><strong>Distance Fare:</strong> ₹{{ fareEstimate.distanceFare }}</p>
                        <p><strong>Time Fare:</strong> ₹{{ fareEstimate.timeFare }}</p>
                      </div>
                    </div>
                    <hr>
                    <div class="text-center">
                      <a routerLink="/home" class="btn btn-success me-2">
                        <i class="fas fa-car"></i> Book Now
                      </a>
                      <button class="btn btn-outline-primary" (click)="resetForm()">
                        <i class="fas fa-calculator"></i> Calculate Another
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vehicle Types Section -->
    <section class="vehicles-section py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Our Vehicle Types</h2>
            <p class="text-muted">Choose the perfect vehicle for your journey</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mb-4" *ngFor="let vehicle of vehicleTypes">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-car fa-3x text-primary mb-3"></i>
                <h5>{{ vehicle.name }}</h5>
                <p class="text-muted">{{ vehicle.description }}</p>
                <div class="vehicle-details">
                  <p><strong>Base Fare:</strong> ₹{{ vehicle.baseFare }}</p>
                  <p><strong>Per KM:</strong> ₹{{ vehicle.perKmRate }}</p>
                  <p><strong>Per Hour:</strong> ₹{{ vehicle.perHourRate }}</p>
                  <p><strong>Capacity:</strong> {{ vehicle.capacity }} persons</p>
                </div>
                <div class="vehicle-features mt-3">
                  <small class="text-muted">
                    <span *ngFor="let feature of vehicle.features" class="badge bg-light text-dark me-1">
                      {{ feature }}
                    </span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tips Section -->
    <section class="tips-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Fare Calculation Tips</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-clock fa-2x text-primary mb-3"></i>
              <h5>Peak Hours</h5>
              <p>Fares may vary during peak hours (7-9 AM, 6-8 PM)</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-route fa-2x text-primary mb-3"></i>
              <h5>Route Optimization</h5>
              <p>We use the most efficient route for accurate estimates</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-info-circle fa-2x text-primary mb-3"></i>
              <h5>Transparent Pricing</h5>
              <p>No hidden charges. All costs are clearly displayed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .estimator-section {
      background: var(--light-color);
    }
    
    .vehicles-section {
      background: white;
    }
    
    .tips-section {
      background: var(--light-color);
    }
    
    .vehicle-details p {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .vehicle-features .badge {
      font-size: 0.7rem;
    }
  `]
})
export class FareEstimatorComponent implements OnInit {
  estimatorForm: FormGroup;
  vehicleTypes: VehicleType[] = [];
  fareEstimate: FareEstimate | null = null;
  isCalculating = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private router: Router
  ) {
    this.estimatorForm = this.fb.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      tripType: ['', Validators.required],
      vehicleType: ['', Validators.required],
      hours: [1, [Validators.min(1), Validators.max(24)]]
    });
  }

  ngOnInit(): void {
    this.loadVehicleTypes();
  }

  loadVehicleTypes(): void {
    this.bookingService.getVehicleTypes().subscribe(types => {
      this.vehicleTypes = types;
    });
  }

  calculateFare(): void {
    if (this.estimatorForm.valid) {
      this.isCalculating = true;
      const formValue = this.estimatorForm.value;

      this.bookingService.estimateFare(
        formValue.fromLocation,
        formValue.toLocation,
        formValue.vehicleType,
        formValue.tripType,
        formValue.hours
      ).subscribe({
        next: (estimate) => {
          this.fareEstimate = estimate;
          this.isCalculating = false;
        },
        error: (error) => {
          this.isCalculating = false;
          alert('Failed to calculate fare. Please try again.');
          console.error('Fare calculation error:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.estimatorForm.reset();
    this.fareEstimate = null;
  }
}
