import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>Our Services</h1>
            <p>Comprehensive taxi services for all your travel needs</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-grid py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-4 mb-4" *ngFor="let service of services">
            <div class="service-card">
              <div class="service-icon">
                <i [class]="service.icon"></i>
              </div>
              <h4>{{ service.title }}</h4>
              <p>{{ service.description }}</p>
              <ul class="service-features">
                <li *ngFor="let feature of service.features">{{ feature }}</li>
              </ul>
              <div class="service-actions">
                <a routerLink="/home" class="btn btn-primary">Book Now</a>
                <a [href]="'https://wa.me/919876543210?text=I want to know more about ' + service.title" target="_blank" class="btn btn-success">
                  <i class="fab fa-whatsapp"></i> Enquire
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Details -->
    <section class="service-details py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Service Details</h2>
            <p class="text-muted">Learn more about our specialized services</p>
          </div>
        </div>
        
        <!-- Local Taxi Service -->
        <div class="row mb-5">
          <div class="col-md-6">
            <div class="service-detail-card">
              <h3><i class="fas fa-car text-primary"></i> Local Taxi Service</h3>
              <p>Quick and reliable local transportation within the city limits. Perfect for daily commutes, shopping trips, and short-distance travel.</p>
              <div class="service-highlights">
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Same day booking available</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Professional drivers</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Fixed pricing</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>24/7 availability</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="service-image">
              <div class="image-placeholder">
                <i class="fas fa-car fa-4x text-muted"></i>
                <p>Local Taxi Service</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Airport Transfer Service -->
        <div class="row mb-5">
          <div class="col-md-6 order-md-2">
            <div class="service-detail-card">
              <h3><i class="fas fa-plane text-primary"></i> Airport Transfer Service</h3>
              <p>Comfortable and timely airport pickup and drop services. We ensure you never miss your flight with our punctual service.</p>
              <div class="service-highlights">
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Flight tracking</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Meet & greet service</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Luggage assistance</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Fixed airport rates</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 order-md-1">
            <div class="service-image">
              <div class="image-placeholder">
                <i class="fas fa-plane fa-4x text-muted"></i>
                <p>Airport Transfer</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Outstation Travel -->
        <div class="row mb-5">
          <div class="col-md-6">
            <div class="service-detail-card">
              <h3><i class="fas fa-route text-primary"></i> Outstation Travel</h3>
              <p>Long-distance travel with experienced drivers. Perfect for business trips, family vacations, and inter-city travel.</p>
              <div class="service-highlights">
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Experienced drivers</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Multiple vehicle options</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Round trip packages</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Hotel booking assistance</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="service-image">
              <div class="image-placeholder">
                <i class="fas fa-route fa-4x text-muted"></i>
                <p>Outstation Travel</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Corporate Travel -->
        <div class="row mb-5">
          <div class="col-md-6 order-md-2">
            <div class="service-detail-card">
              <h3><i class="fas fa-building text-primary"></i> Corporate Travel</h3>
              <p>Dedicated corporate travel solutions for businesses. We provide reliable transportation for your employees and clients.</p>
              <div class="service-highlights">
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Monthly billing</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Dedicated account manager</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Detailed reports</span>
                </div>
                <div class="highlight-item">
                  <i class="fas fa-check text-success"></i>
                  <span>Priority booking</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 order-md-1">
            <div class="service-image">
              <div class="image-placeholder">
                <i class="fas fa-building fa-4x text-muted"></i>
                <p>Corporate Travel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-choose-us py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Why Choose VK Drop Taxi?</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mb-4" *ngFor="let feature of features">
            <div class="feature-card text-center">
              <div class="feature-icon">
                <i [class]="feature.icon"></i>
              </div>
              <h5>{{ feature.title }}</h5>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h2>Ready to Book Your Ride?</h2>
            <p class="lead">Experience the best taxi service in town</p>
            <div class="cta-buttons">
              <a routerLink="/home" class="btn btn-light btn-lg me-3">
                <i class="fas fa-car"></i> Book Now
              </a>
              <a href="https://wa.me/919876543210" target="_blank" class="btn btn-success btn-lg">
                <i class="fab fa-whatsapp"></i> WhatsApp Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .services-grid {
      background: white;
    }
    
    .service-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      height: 100%;
    }
    
    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    
    .service-icon {
      margin-bottom: 20px;
    }
    
    .service-icon i {
      font-size: 3rem;
      color: var(--primary-color);
    }
    
    .service-features {
      list-style: none;
      padding: 0;
      margin: 20px 0;
      text-align: left;
    }
    
    .service-features li {
      padding: 5px 0;
      position: relative;
      padding-left: 20px;
    }
    
    .service-features li:before {
      content: "✓";
      color: var(--success-color);
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .service-actions {
      margin-top: 20px;
    }
    
    .service-actions .btn {
      margin: 5px;
    }
    
    .service-detail-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      height: 100%;
    }
    
    .service-highlights {
      margin-top: 20px;
    }
    
    .highlight-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .highlight-item i {
      margin-right: 10px;
      width: 20px;
    }
    
    .service-image {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .image-placeholder {
      background: white;
      border-radius: 15px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      width: 100%;
    }
    
    .feature-card {
      background: white;
      padding: 30px 20px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
    }
    
    .feature-icon i {
      font-size: 2.5rem;
      color: var(--primary-color);
      margin-bottom: 20px;
    }
    
    .cta-section {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%);
    }
    
    .cta-buttons {
      margin-top: 30px;
    }
    
    @media (max-width: 768px) {
      .service-detail-card {
        margin-bottom: 20px;
      }
      
      .service-image {
        margin-bottom: 20px;
      }
    }
  `]
})
export class ServicesComponent {
  services = [
    {
      title: 'Local Taxi',
      description: 'Quick and reliable local transportation within the city',
      icon: 'fas fa-car',
      features: ['Same day booking', 'Professional drivers', 'Fixed pricing', '24/7 availability']
    },
    {
      title: 'Airport Transfer',
      description: 'Comfortable airport pickup and drop services',
      icon: 'fas fa-plane',
      features: ['Flight tracking', 'Meet & greet', 'Luggage assistance', 'Fixed rates']
    },
    {
      title: 'Outstation Travel',
      description: 'Long-distance travel with experienced drivers',
      icon: 'fas fa-route',
      features: ['Experienced drivers', 'Multiple vehicles', 'Round trip packages', 'Hotel assistance']
    },
    {
      title: 'Corporate Travel',
      description: 'Dedicated corporate travel solutions',
      icon: 'fas fa-building',
      features: ['Monthly billing', 'Account manager', 'Detailed reports', 'Priority booking']
    },
    {
      title: 'Hourly Rental',
      description: 'Flexible hourly taxi rental services',
      icon: 'fas fa-clock',
      features: ['Flexible hours', 'Multiple stops', 'Professional service', 'Transparent pricing']
    },
    {
      title: 'Luxury Travel',
      description: 'Premium luxury vehicle services',
      icon: 'fas fa-crown',
      features: ['Premium vehicles', 'Professional chauffeurs', 'Premium service', 'Luxury experience']
    }
  ];

  features = [
    {
      title: 'Professional Drivers',
      description: 'All our drivers are verified, trained, and experienced professionals',
      icon: 'fas fa-user-tie'
    },
    {
      title: 'Safe & Secure',
      description: 'Your safety is our top priority with well-maintained vehicles',
      icon: 'fas fa-shield-alt'
    },
    {
      title: '24/7 Support',
      description: 'Round the clock customer support for all your needs',
      icon: 'fas fa-headset'
    },
    {
      title: 'Best Prices',
      description: 'Competitive rates with no hidden charges or surprises',
      icon: 'fas fa-rupee-sign'
    }
  ];

  constructor(private router: Router) {}
}
