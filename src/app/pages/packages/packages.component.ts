import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent {
  packages = [
    {
      icon: 'fas fa-car fa-3x',
      name: 'Local Package',
      price: '500',
      unit: '/day',
      description: 'Perfect for local city travel with flexible timing',
      features: ['8 hours / 80 km', 'Professional driver', 'AC vehicle', 'Fuel included', 'Toll charges extra']
    },
    {
      icon: 'fas fa-plane fa-3x',
      name: 'Airport Package',
      price: '800',
      unit: '/trip',
      description: 'Reliable airport pickup and drop service',
      features: ['Flight tracking', 'Meet & greet', 'Luggage assistance', 'Waiting time included', 'Fixed pricing']
    },
    {
      icon: 'fas fa-route fa-3x',
      name: 'Outstation Package',
      price: '1500',
      unit: '/day',
      description: 'Long-distance travel with experienced drivers',
      features: ['12 hours / 300 km', 'Experienced driver', 'Comfortable vehicle', 'GPS tracking', '24/7 support']
    },
    {
      icon: 'fas fa-clock fa-3x',
      name: 'Hourly Package',
      price: '200',
      unit: '/hour',
      description: 'Flexible hourly rental for your convenience',
      features: ['Minimum 4 hours', 'Multiple stops allowed', 'Professional service', 'Transparent billing', 'No hidden charges']
    },
    {
      icon: 'fas fa-users fa-3x',
      name: 'Corporate Package',
      price: '1200',
      unit: '/day',
      description: 'Dedicated corporate travel solutions',
      features: ['Monthly billing', 'Dedicated fleet', 'Priority booking', 'Detailed reports', 'Account manager']
    },
    {
      icon: 'fas fa-star fa-3x',
      name: 'Luxury Package',
      price: '2500',
      unit: '/day',
      description: 'Premium luxury vehicles for special occasions',
      features: ['Premium vehicles', 'Professional chauffeur', 'Premium amenities', 'VIP treatment', 'Concierge service']
    }
  ];

  destinations = [
    {
      icon: 'fas fa-mountain fa-3x',
      name: 'Lonavala',
      description: 'Scenic hill station perfect for weekend getaways',
      distance: '83 km',
      duration: '2 hours',
      price: '1200'
    },
    {
      icon: 'fas fa-umbrella-beach fa-3x',
      name: 'Alibaug',
      description: 'Beautiful beach destination for relaxation',
      distance: '95 km',
      duration: '2.5 hours',
      price: '1400'
    },
    {
      icon: 'fas fa-tree fa-3x',
      name: 'Mahabaleshwar',
      description: 'Famous hill station known for strawberries',
      distance: '260 km',
      duration: '5 hours',
      price: '2500'
    },
    {
      icon: 'fas fa-water fa-3x',
      name: 'Goa',
      description: 'Popular beach destination for fun and adventure',
      distance: '590 km',
      duration: '10 hours',
      price: '4500'
    },
    {
      icon: 'fas fa-mosque fa-3x',
      name: 'Aurangabad',
      description: 'Historical city with ancient monuments',
      distance: '330 km',
      duration: '6 hours',
      price: '2800'
    },
    {
      icon: 'fas fa-mountain fa-3x',
      name: 'Pune',
      description: 'Educational and cultural hub of Maharashtra',
      distance: '148 km',
      duration: '3 hours',
      price: '1800'
    }
  ];

  comparisonFeatures = [
    {
      name: 'Professional Driver',
      basic: true,
      standard: true,
      premium: true
    },
    {
      name: 'AC Vehicle',
      basic: true,
      standard: true,
      premium: true
    },
    {
      name: 'GPS Tracking',
      basic: false,
      standard: true,
      premium: true
    },
    {
      name: 'Meet & Greet',
      basic: false,
      standard: true,
      premium: true
    },
    {
      name: 'Luxury Vehicle',
      basic: false,
      standard: false,
      premium: true
    },
    {
      name: 'Chauffeur Service',
      basic: false,
      standard: false,
      premium: true
    },
    {
      name: '24/7 Support',
      basic: false,
      standard: true,
      premium: true
    },
    {
      name: 'Priority Booking',
      basic: false,
      standard: false,
      premium: true
    }
  ];

  specialOffers = [
    {
      discount: '20%',
      title: 'Weekend Special',
      description: 'Get 20% off on all weekend bookings',
      validTill: '31 Dec 2024'
    },
    {
      discount: '15%',
      title: 'First Time User',
      description: 'Special discount for first-time customers',
      validTill: '31 Dec 2024'
    },
    {
      discount: '25%',
      title: 'Corporate Discount',
      description: 'Exclusive discount for corporate clients',
      validTill: '31 Dec 2024'
    }
  ];
}
