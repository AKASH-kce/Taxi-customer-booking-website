import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services = [
    {
      icon: 'fas fa-car fa-3x',
      title: 'Local Taxi',
      description: 'Quick and reliable local transportation within the city',
      features: ['Same day booking', 'Professional drivers', 'Fixed pricing', '24/7 availability']
    },
    {
      icon: 'fas fa-plane fa-3x',
      title: 'Airport Transfer',
      description: 'Comfortable airport pickup and drop services',
      features: ['Flight tracking', 'Meet & greet', 'Luggage assistance', 'Fixed rates']
    },
    {
      icon: 'fas fa-route fa-3x',
      title: 'Outstation Travel',
      description: 'Long-distance travel with experienced drivers',
      features: ['Experienced drivers', 'Comfortable vehicles', 'GPS tracking', '24/7 support']
    },
    {
      icon: 'fas fa-clock fa-3x',
      title: 'Hourly Rental',
      description: 'Flexible hourly rental for your convenience',
      features: ['Flexible timing', 'Multiple stops', 'Professional service', 'Transparent billing']
    },
    {
      icon: 'fas fa-users fa-3x',
      title: 'Corporate Travel',
      description: 'Dedicated corporate travel solutions',
      features: ['Corporate accounts', 'Monthly billing', 'Dedicated fleet', 'Priority booking']
    },
    {
      icon: 'fas fa-star fa-3x',
      title: 'Luxury Service',
      description: 'Premium luxury vehicles for special occasions',
      features: ['Premium vehicles', 'Chauffeur service', 'Premium amenities', 'VIP treatment']
    }
  ];

  pricingPlans = [
    {
      name: 'Hatchback',
      basePrice: '12',
      features: ['4 passengers', 'AC', 'Music System', 'GPS Navigation', 'Professional Driver']
    },
    {
      name: 'Sedan',
      basePrice: '15',
      features: ['4 passengers', 'AC', 'Music System', 'GPS Navigation', 'Professional Driver', 'Leather Seats']
    },
    {
      name: 'SUV',
      basePrice: '18',
      features: ['6 passengers', 'AC', 'Music System', 'GPS Navigation', 'Professional Driver', 'Extra Space']
    }
  ];
}
