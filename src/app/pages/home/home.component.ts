import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BookingFormComponent } from '../../components/booking-form/booking-form.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BookingFormComponent, ServiceCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading = false;
  showSuccessMessage = false;
  successMessage = '';

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onBookingSubmitted(booking: Booking) {
    this.isLoading = true;
    
    this.bookingService.createBooking(booking).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccessMessage = true;
        this.successMessage = `Booking successful! Your booking ID is ${response.id}`;
        
        // Redirect to booking status page after 3 seconds
        // setTimeout(() => {
        //   this.router.navigate(['/booking-status'], { 
        //     queryParams: { bookingId: response.id } 
        //   });
        // }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Booking failed:', error);
        // Handle error - show error message
      }
    });
  }
}
