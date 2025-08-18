import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>Track Your Booking</h1>
            <p>Check the status of your taxi booking</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tracking Form -->
    <section class="tracking-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-body p-4">
                <h3 class="text-center mb-4">Track Booking Status</h3>
                
                <form [formGroup]="trackingForm" (ngSubmit)="trackBooking()">
                  <div class="row">
                    <!-- Search Method -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label">Search By</label>
                      <select class="form-select" formControlName="searchMethod">
                        <option value="bookingId">Booking ID</option>
                        <option value="phone">Phone Number</option>
                      </select>
                    </div>

                    <!-- Search Input -->
                    <div class="col-md-8 mb-3">
                      <label class="form-label">
                        {{ trackingForm.get('searchMethod')?.value === 'bookingId' ? 'Booking ID' : 'Phone Number' }}
                      </label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i *ngIf="trackingForm.get('searchMethod')?.value === 'bookingId'" class="fas fa-hashtag"></i>
                          <i *ngIf="trackingForm.get('searchMethod')?.value === 'phone'" class="fas fa-phone"></i>
                        </span>
                        <input 
                          type="text" 
                          class="form-control" 
                          formControlName="searchValue"
                          [placeholder]="trackingForm.get('searchMethod')?.value === 'bookingId' ? 'Enter booking ID' : 'Enter phone number'"
                        >
                      </div>
                    </div>

                    <!-- Search Button -->
                    <div class="col-12 text-center">
                      <button 
                        type="submit" 
                        class="btn btn-primary btn-lg"
                        [disabled]="trackingForm.invalid || isSearching"
                      >
                        <span *ngIf="isSearching" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isSearching ? 'Searching...' : 'Track Booking' }}
                      </button>
                    </div>
                  </div>
                </form>

                <!-- Booking Results -->
                <div *ngIf="bookings.length > 0" class="mt-4">
                  <h4 class="mb-3">Booking Details</h4>
                  <div class="booking-list">
                    <div *ngFor="let booking of bookings" class="booking-item card mb-3">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-8">
                            <h5 class="card-title">Booking ID: {{ booking.bookingId }}</h5>
                            <div class="row">
                              <div class="col-md-6">
                                <p><strong>Customer:</strong> {{ booking.customerName }}</p>
                                <p><strong>Phone:</strong> {{ booking.customerPhone }}</p>
                                <p><strong>Date:</strong> {{ booking.date }}</p>
                                <p><strong>Time:</strong> {{ booking.time }}</p>
                              </div>
                              <div class="col-md-6">
                                <p><strong>From:</strong> {{ booking.pickupLocation }}</p>
                                <p><strong>To:</strong> {{ booking.dropLocation }}</p>
                                <p><strong>Vehicle:</strong> {{ booking.vehicleType | titlecase }}</p>
                                <p><strong>Fare:</strong> ₹{{ booking.estimatedFare }}</p>
                              </div>
                            </div>
                          </div>
                          <div class="col-md-4 text-center">
                            <div class="status-section">
                              <div class="status-badge" [ngClass]="getStatusClass(booking.status)">
                                {{ booking.status | titlecase }}
                              </div>
                              <div class="status-timeline mt-3">
                                <div class="timeline-item" [class.active]="booking.status === 'pending'">
                                  <i class="fas fa-clock"></i>
                                  <span>Pending</span>
                                </div>
                                <div class="timeline-item" [class.active]="booking.status === 'accepted'">
                                  <i class="fas fa-check"></i>
                                  <span>Accepted</span>
                                </div>
                                <div class="timeline-item" [class.active]="booking.status === 'assigned'">
                                  <i class="fas fa-user"></i>
                                  <span>Driver Assigned</span>
                                </div>
                                <div class="timeline-item" [class.active]="booking.status === 'completed'">
                                  <i class="fas fa-flag-checkered"></i>
                                  <span>Completed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Driver Details (if assigned) -->
                        <div *ngIf="booking.driverName" class="driver-details mt-3 p-3 bg-light rounded">
                          <h6>Driver Details</h6>
                          <div class="row">
                            <div class="col-md-4">
                              <p><strong>Driver:</strong> {{ booking.driverName }}</p>
                            </div>
                            <div class="col-md-4">
                              <p><strong>Phone:</strong> {{ booking.driverPhone }}</p>
                            </div>
                            <div class="col-md-4">
                              <p><strong>Vehicle:</strong> {{ booking.vehicleNumber }}</p>
                            </div>
                          </div>
                          <div class="text-center mt-2">
                            <a [href]="'tel:' + booking.driverPhone" class="btn btn-success btn-sm me-2">
                              <i class="fas fa-phone"></i> Call Driver
                            </a>
                            <a [href]="'https://wa.me/' + booking.driverPhone" target="_blank" class="btn btn-success btn-sm">
                              <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                          </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="action-buttons mt-3 text-center">
                          <button class="btn btn-outline-primary btn-sm me-2" (click)="copyBookingId(booking.bookingId)">
                            <i class="fas fa-copy"></i> Copy ID
                          </button>
                          <a [href]="'https://wa.me/919876543210?text=Booking ID: ' + booking.bookingId" target="_blank" class="btn btn-success btn-sm me-2">
                            <i class="fab fa-whatsapp"></i> Support
                          </a>
                          <a [href]="'tel:+919876543210'" class="btn btn-primary btn-sm">
                            <i class="fas fa-phone"></i> Call Support
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- No Results -->
                <div *ngIf="searched && bookings.length === 0" class="mt-4">
                  <div class="alert alert-warning text-center">
                    <i class="fas fa-search fa-2x mb-3"></i>
                    <h5>No bookings found</h5>
                    <p>Please check your booking ID or phone number and try again.</p>
                    <a routerLink="/home" class="btn btn-primary">Book New Taxi</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Help Section -->
    <section class="help-section py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Need Help?</h2>
            <p class="text-muted">We're here to help you with your booking</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-phone fa-2x text-primary mb-3"></i>
              <h5>Call Us</h5>
              <p>+91 98765 43210</p>
              <a href="tel:+919876543210" class="btn btn-outline-primary">Call Now</a>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fab fa-whatsapp fa-2x text-success mb-3"></i>
              <h5>WhatsApp</h5>
              <p>Get instant support via WhatsApp</p>
              <a href="https://wa.me/919876543210" target="_blank" class="btn btn-success">Chat Now</a>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="text-center">
              <i class="fas fa-envelope fa-2x text-info mb-3"></i>
              <h5>Email</h5>
              <p>Send us an email for support</p>
              <a href="mailto:info@vkdrop.com" class="btn btn-outline-info">Email Us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tracking-section {
      background: var(--light-color);
    }
    
    .booking-item {
      border-left: 4px solid var(--primary-color);
    }
    
    .status-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .status-timeline {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .timeline-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .timeline-item.active {
      color: var(--primary-color);
      font-weight: bold;
    }
    
    .timeline-item i {
      width: 20px;
    }
    
    .driver-details {
      border-left: 3px solid var(--success-color);
    }
    
    .action-buttons {
      border-top: 1px solid #dee2e6;
      padding-top: 15px;
    }
    
    .help-section {
      background: white;
    }
  `]
})
export class BookingStatusComponent {
  trackingForm: FormGroup;
  bookings: Booking[] = [];
  isSearching = false;
  searched = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {
    this.trackingForm = this.fb.group({
      searchMethod: ['bookingId', Validators.required],
      searchValue: ['', Validators.required]
    });

    // Update placeholder when search method changes
    this.trackingForm.get('searchMethod')?.valueChanges.subscribe(method => {
      const searchValueControl = this.trackingForm.get('searchValue');
      if (method === 'phone') {
        searchValueControl?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
      } else {
        searchValueControl?.setValidators([Validators.required]);
      }
      searchValueControl?.updateValueAndValidity();
    });
  }

  trackBooking(): void {
    if (this.trackingForm.valid) {
      this.isSearching = true;
      this.searched = true;
      const formValue = this.trackingForm.value;

      if (formValue.searchMethod === 'bookingId') {
        this.bookingService.getBookingById(formValue.searchValue).subscribe({
          next: (booking) => {
            this.isSearching = false;
            this.bookings = booking ? [booking] : [];
          },
          error: (error) => {
            this.isSearching = false;
            this.bookings = [];
            console.error('Error fetching booking:', error);
          }
        });
      } else {
        this.bookingService.getBookingsByPhone(formValue.searchValue).subscribe({
          next: (bookings) => {
            this.isSearching = false;
            this.bookings = bookings;
          },
          error: (error) => {
            this.isSearching = false;
            this.bookings = [];
            console.error('Error fetching bookings:', error);
          }
        });
      }
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'assigned': return 'status-assigned';
      case 'completed': return 'status-completed';
      default: return 'status-pending';
    }
  }

  copyBookingId(bookingId: string): void {
    navigator.clipboard.writeText(bookingId).then(() => {
      alert('Booking ID copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = bookingId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Booking ID copied to clipboard!');
    });
  }
}
