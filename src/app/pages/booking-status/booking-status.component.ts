import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss']
})
export class BookingStatusComponent implements OnInit {
  searchForm: FormGroup;
  isSearching = false;
  bookingDetails: any = null;
  recentBookings: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      bookingId: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  ngOnInit(): void {
    // Check if booking ID is provided in URL params
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.searchForm.patchValue({
          bookingId: params['bookingId']
        });
        this.searchBooking();
      }
    });

    // Load recent bookings
    this.loadRecentBookings();
  }

  searchBooking(): void {
    if (this.searchForm.valid) {
      this.isSearching = true;
      
      // Simulate API call
      setTimeout(() => {
        const formValue = this.searchForm.value;
        
        // Mock booking data
        this.bookingDetails = {
          id: formValue.bookingId,
          status: 'driver-enroute',
          pickupLocation: 'Mumbai Airport',
          dropLocation: 'Bandra West',
          pickupDate: new Date('2024-01-15'),
          pickupTime: '14:30',
          vehicleType: 'Sedan',
          estimatedFare: 850,
          driverName: 'Rajesh Kumar',
          driverPhone: '+91 98765 43210',
          vehicleNumber: 'MH-01-AB-1234',
          confirmedAt: new Date('2024-01-15T14:00:00'),
          driverAssignedAt: new Date('2024-01-15T14:05:00'),
          driverEnrouteAt: new Date('2024-01-15T14:15:00'),
          arrivedAt: null,
          startedAt: null,
          completedAt: null
        };
        
        this.isSearching = false;
      }, 1500);
    }
  }

  loadRecentBookings(): void {
    // Mock recent bookings data
    this.recentBookings = [
      {
        id: 'BK001',
        status: 'completed',
        pickupLocation: 'Andheri Station',
        dropLocation: 'BKC',
        pickupDate: new Date('2024-01-10'),
        estimatedFare: 450
      },
      {
        id: 'BK002',
        status: 'completed',
        pickupLocation: 'Dadar Station',
        dropLocation: 'Worli',
        pickupDate: new Date('2024-01-12'),
        estimatedFare: 380
      },
      {
        id: 'BK003',
        status: 'in-progress',
        pickupLocation: 'Mumbai Airport',
        dropLocation: 'Juhu',
        pickupDate: new Date('2024-01-15'),
        estimatedFare: 650
      }
    ];
  }

  loadBooking(bookingId: string): void {
    this.searchForm.patchValue({
      bookingId: bookingId
    });
    this.searchBooking();
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.bookingDetails = null;
  }

  getStatusOrder(status: string): number {
    const statusOrder = {
      'confirmed': 1,
      'driver-assigned': 2,
      'driver-enroute': 3,
      'arrived': 4,
      'in-progress': 5,
      'completed': 6
    };
    return statusOrder[status as keyof typeof statusOrder] || 0;
  }
}
