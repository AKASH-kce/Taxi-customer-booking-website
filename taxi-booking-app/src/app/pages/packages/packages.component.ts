import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>Travel Packages</h1>
            <p>Explore our curated travel packages for your convenience</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Package Categories -->
    <section class="package-categories py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Choose Your Package</h2>
            <p class="text-muted">Select from our wide range of travel packages</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4" *ngFor="let category of categories">
            <div class="category-card" (click)="scrollToSection(category.id)">
              <div class="category-icon">
                <i [class]="category.icon"></i>
              </div>
              <h4>{{ category.title }}</h4>
              <p>{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tour Packages -->
    <section id="tour-packages" class="tour-packages py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Tour Packages</h2>
            <p class="text-muted">Explore popular destinations with our tour packages</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let package of tourPackages">
            <div class="package-card" [class.popular]="package.popular">
              <div class="package-header">
                <h4>{{ package.name }}</h4>
                <div class="package-price">₹{{ package.price }}</div>
                <div *ngIf="package.popular" class="popular-badge">Most Popular</div>
              </div>
              <div class="package-body">
                <div class="package-details">
                  <p><i class="fas fa-clock"></i> {{ package.duration }}</p>
                  <p><i class="fas fa-route"></i> {{ package.distance }}</p>
                </div>
                <p class="package-description">{{ package.description }}</p>
                <ul class="package-features">
                  <li *ngFor="let feature of package.features">{{ feature }}</li>
                </ul>
                <div class="package-actions">
                  <a routerLink="/home" class="btn btn-primary">Book Now</a>
                  <a [href]="'https://wa.me/919876543210?text=I want to know more about ' + package.name" target="_blank" class="btn btn-success">
                    <i class="fab fa-whatsapp"></i> Enquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hourly Packages -->
    <section id="hourly-packages" class="hourly-packages py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Hourly Packages</h2>
            <p class="text-muted">Flexible hourly rental packages for your needs</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let package of hourlyPackages">
            <div class="package-card">
              <div class="package-header">
                <h4>{{ package.name }}</h4>
                <div class="package-price">₹{{ package.price }}/hr</div>
              </div>
              <div class="package-body">
                <div class="package-details">
                  <p><i class="fas fa-clock"></i> {{ package.duration }}</p>
                  <p><i class="fas fa-users"></i> {{ package.capacity }} persons</p>
                </div>
                <p class="package-description">{{ package.description }}</p>
                <ul class="package-features">
                  <li *ngFor="let feature of package.features">{{ feature }}</li>
                </ul>
                <div class="package-actions">
                  <a routerLink="/home" class="btn btn-primary">Book Now</a>
                  <a [href]="'https://wa.me/919876543210?text=I want to know more about ' + package.name" target="_blank" class="btn btn-success">
                    <i class="fab fa-whatsapp"></i> Enquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Travel Packages -->
    <section id="travel-packages" class="travel-packages py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Travel Packages</h2>
            <p class="text-muted">Long-distance travel packages for business and leisure</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let package of travelPackages">
            <div class="package-card">
              <div class="package-header">
                <h4>{{ package.name }}</h4>
                <div class="package-price">₹{{ package.price }}</div>
              </div>
              <div class="package-body">
                <div class="package-details">
                  <p><i class="fas fa-map-marker-alt"></i> {{ package.route }}</p>
                  <p><i class="fas fa-clock"></i> {{ package.duration }}</p>
                </div>
                <p class="package-description">{{ package.description }}</p>
                <ul class="package-features">
                  <li *ngFor="let feature of package.features">{{ feature }}</li>
                </ul>
                <div class="package-actions">
                  <a routerLink="/home" class="btn btn-primary">Book Now</a>
                  <a [href]="'https://wa.me/919876543210?text=I want to know more about ' + package.name" target="_blank" class="btn btn-success">
                    <i class="fab fa-whatsapp"></i> Enquire
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Custom Package -->
    <section class="custom-package py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <div class="custom-package-card">
              <h2>Need a Custom Package?</h2>
              <p class="lead">We can create a custom package tailored to your specific requirements</p>
              <div class="custom-features">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <i class="fas fa-route fa-2x text-primary mb-2"></i>
                    <h5>Custom Routes</h5>
                    <p>Choose your own route and stops</p>
                  </div>
                  <div class="col-md-4 mb-3">
                    <i class="fas fa-clock fa-2x text-primary mb-2"></i>
                    <h5>Flexible Timing</h5>
                    <p>Pick up and drop at your convenience</p>
                  </div>
                  <div class="col-md-4 mb-3">
                    <i class="fas fa-car fa-2x text-primary mb-2"></i>
                    <h5>Vehicle Choice</h5>
                    <p>Select from our fleet of vehicles</p>
                  </div>
                </div>
              </div>
              <div class="custom-actions">
                <a routerLink="/home" class="btn btn-primary btn-lg me-3">
                  <i class="fas fa-car"></i> Book Custom Package
                </a>
                <a href="https://wa.me/919876543210?text=I want to discuss a custom package" target="_blank" class="btn btn-success btn-lg">
                  <i class="fab fa-whatsapp"></i> Discuss Requirements
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .package-categories {
      background: white;
    }
    
    .category-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      height: 100%;
    }
    
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .category-icon i {
      font-size: 3rem;
      color: var(--primary-color);
      margin-bottom: 20px;
    }
    
    .package-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      height: 100%;
      position: relative;
    }
    
    .package-card:hover {
      transform: translateY(-5px);
    }
    
    .package-card.popular {
      border: 2px solid var(--primary-color);
    }
    
    .package-header {
      background: var(--primary-color);
      color: white;
      padding: 20px;
      text-align: center;
      position: relative;
    }
    
    .package-price {
      font-size: 2rem;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .popular-badge {
      position: absolute;
      top: -10px;
      right: 20px;
      background: var(--accent-color);
      color: #212529;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: bold;
    }
    
    .package-body {
      padding: 30px;
    }
    
    .package-details {
      margin-bottom: 20px;
    }
    
    .package-details p {
      margin-bottom: 5px;
      color: #6c757d;
    }
    
    .package-details i {
      width: 20px;
      margin-right: 10px;
    }
    
    .package-description {
      margin-bottom: 20px;
      color: #6c757d;
    }
    
    .package-features {
      list-style: none;
      padding: 0;
      margin-bottom: 20px;
    }
    
    .package-features li {
      padding: 5px 0;
      position: relative;
      padding-left: 20px;
    }
    
    .package-features li:before {
      content: "✓";
      color: var(--success-color);
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .package-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .package-actions .btn {
      flex: 1;
      min-width: 120px;
    }
    
    .custom-package-card {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .custom-features {
      margin: 30px 0;
    }
    
    .custom-actions {
      margin-top: 30px;
    }
    
    @media (max-width: 768px) {
      .package-actions {
        flex-direction: column;
      }
      
      .package-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class PackagesComponent {
  categories = [
    {
      id: 'tour-packages',
      title: 'Tour Packages',
      description: 'Explore popular destinations with guided tours',
      icon: 'fas fa-map-marked-alt'
    },
    {
      id: 'hourly-packages',
      title: 'Hourly Packages',
      description: 'Flexible hourly rental for your convenience',
      icon: 'fas fa-clock'
    },
    {
      id: 'travel-packages',
      title: 'Travel Packages',
      description: 'Long-distance travel for business and leisure',
      icon: 'fas fa-route'
    }
  ];

  tourPackages = [
    {
      name: 'Mumbai City Tour',
      price: 2500,
      duration: '8 Hours',
      distance: 'City Tour',
      description: 'Explore the best of Mumbai with our comprehensive city tour package.',
      features: ['Gateway of India', 'Marine Drive', 'Juhu Beach', 'Local Guide', 'Lunch Included'],
      popular: true
    },
    {
      name: 'Lonavala Day Trip',
      price: 3500,
      duration: '12 Hours',
      distance: '200 km round trip',
      description: 'Perfect day trip to the beautiful hill station of Lonavala.',
      features: ['Tiger Point', 'Karla Caves', 'Bushi Dam', 'Local Sightseeing', 'Refreshments'],
      popular: false
    },
    {
      name: 'Mahabaleshwar Weekend',
      price: 8000,
      duration: '2 Days',
      distance: '300 km round trip',
      description: 'Weekend getaway to the scenic hill station of Mahabaleshwar.',
      features: ['Hotel Accommodation', 'All Sightseeing', 'Meals Included', 'Professional Driver', 'Flexible Itinerary'],
      popular: false
    }
  ];

  hourlyPackages = [
    {
      name: 'Sedan Hourly',
      price: 200,
      duration: 'Minimum 4 hours',
      capacity: '4 persons',
      description: 'Comfortable sedan for hourly rental with professional driver.',
      features: ['AC Vehicle', 'Professional Driver', 'Fuel Included', 'Flexible Hours', 'City Limits']
    },
    {
      name: 'SUV Hourly',
      price: 300,
      duration: 'Minimum 4 hours',
      capacity: '6 persons',
      description: 'Spacious SUV perfect for family outings and group travel.',
      features: ['AC Vehicle', 'Professional Driver', 'Fuel Included', 'Extra Space', 'City Limits']
    },
    {
      name: 'Luxury Hourly',
      price: 500,
      duration: 'Minimum 4 hours',
      capacity: '4 persons',
      description: 'Premium luxury vehicle for special occasions and business travel.',
      features: ['Premium Vehicle', 'Professional Chauffeur', 'Fuel Included', 'Premium Service', 'City Limits']
    }
  ];

  travelPackages = [
    {
      name: 'Mumbai to Pune',
      price: 4000,
      route: 'Mumbai - Pune',
      duration: '3-4 hours',
      description: 'Comfortable travel between Mumbai and Pune with professional service.',
      features: ['One Way/Return', 'Professional Driver', 'Fuel Included', 'Toll Charges', 'Flexible Timing']
    },
    {
      name: 'Mumbai to Nashik',
      price: 6000,
      route: 'Mumbai - Nashik',
      duration: '4-5 hours',
      description: 'Reliable service for travel between Mumbai and Nashik.',
      features: ['One Way/Return', 'Professional Driver', 'Fuel Included', 'Toll Charges', 'Flexible Timing']
    },
    {
      name: 'Mumbai to Goa',
      price: 15000,
      route: 'Mumbai - Goa',
      duration: '12-14 hours',
      description: 'Long-distance travel to Goa with overnight journey option.',
      features: ['One Way/Return', 'Professional Driver', 'Fuel Included', 'Toll Charges', 'Overnight Option']
    }
  ];

  constructor(private router: Router) {}

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
