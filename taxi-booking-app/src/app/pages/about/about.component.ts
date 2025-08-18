import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>About VK Drop Taxi</h1>
            <p>Your trusted partner for safe and reliable transportation</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Content -->
    <section class="about-content py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-body p-4">
                <h2 class="text-center mb-4">Our Story</h2>
                <p class="lead text-center mb-4">
                  VK Drop Taxi Pvt Ltd is a leading taxi service provider committed to delivering exceptional transportation solutions to our valued customers.
                </p>
                
                <div class="row mb-4">
                  <div class="col-md-6">
                    <h4><i class="fas fa-bullseye text-primary"></i> Our Mission</h4>
                    <p>To provide affordable, reliable, and safe transportation services that exceed customer expectations while maintaining the highest standards of professionalism and quality.</p>
                  </div>
                  <div class="col-md-6">
                    <h4><i class="fas fa-eye text-primary"></i> Our Vision</h4>
                    <p>To become the most trusted and preferred taxi service provider, known for our commitment to customer satisfaction, safety, and innovation in transportation solutions.</p>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-6">
                    <h4><i class="fas fa-heart text-primary"></i> Our Values</h4>
                    <ul class="values-list">
                      <li>Customer First Approach</li>
                      <li>Safety & Reliability</li>
                      <li>Professional Excellence</li>
                      <li>Innovation & Technology</li>
                      <li>Environmental Responsibility</li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <h4><i class="fas fa-star text-primary"></i> Why Choose Us</h4>
                    <ul class="values-list">
                      <li>Verified & Trained Drivers</li>
                      <li>Well-Maintained Vehicles</li>
                      <li>24/7 Customer Support</li>
                      <li>Competitive Pricing</li>
                      <li>Advanced Booking System</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row">
          <div class="col-md-3 mb-4 text-center">
            <div class="stat-item">
              <i class="fas fa-users fa-3x mb-3"></i>
              <h3>10,000+</h3>
              <p>Happy Customers</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="stat-item">
              <i class="fas fa-car fa-3x mb-3"></i>
              <h3>50+</h3>
              <p>Fleet Vehicles</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="stat-item">
              <i class="fas fa-route fa-3x mb-3"></i>
              <h3>1000+</h3>
              <p>Trips Daily</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="stat-item">
              <i class="fas fa-award fa-3x mb-3"></i>
              <h3>5+</h3>
              <p>Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Our Team</h2>
            <p class="text-muted">Meet the professionals behind VK Drop Taxi</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="team-card text-center">
              <div class="team-avatar">
                <i class="fas fa-user-tie fa-4x text-primary"></i>
              </div>
              <h4>Management Team</h4>
              <p class="text-muted">Experienced professionals dedicated to providing the best service</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="team-card text-center">
              <div class="team-avatar">
                <i class="fas fa-user-shield fa-4x text-primary"></i>
              </div>
              <h4>Professional Drivers</h4>
              <p class="text-muted">Verified, trained, and experienced drivers ensuring your safety</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="team-card text-center">
              <div class="team-avatar">
                <i class="fas fa-headset fa-4x text-primary"></i>
              </div>
              <h4>Support Team</h4>
              <p class="text-muted">24/7 customer support team ready to assist you anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications -->
    <section class="certifications-section py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Certifications & Awards</h2>
            <p class="text-muted">Recognition of our commitment to excellence</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mb-4 text-center">
            <div class="certification-card">
              <i class="fas fa-certificate fa-3x text-primary mb-3"></i>
              <h5>ISO Certified</h5>
              <p>Quality Management System</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="certification-card">
              <i class="fas fa-shield-alt fa-3x text-primary mb-3"></i>
              <h5>Safety Certified</h5>
              <p>Vehicle & Driver Safety</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="certification-card">
              <i class="fas fa-leaf fa-3x text-primary mb-3"></i>
              <h5>Green Fleet</h5>
              <p>Environmentally Friendly</p>
            </div>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <div class="certification-card">
              <i class="fas fa-trophy fa-3x text-primary mb-3"></i>
              <h5>Best Service</h5>
              <p>Customer Satisfaction Award</p>
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
            <h2>Ready to Experience Our Service?</h2>
            <p class="lead">Book your ride with VK Drop Taxi today</p>
            <div class="cta-buttons">
              <a routerLink="/home" class="btn btn-light btn-lg me-3">
                <i class="fas fa-car"></i> Book Now
              </a>
              <a href="https://wa.me/919876543210" target="_blank" class="btn btn-success btn-lg">
                <i class="fab fa-whatsapp"></i> Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-content {
      background: var(--light-color);
    }
    
    .values-list {
      list-style: none;
      padding: 0;
    }
    
    .values-list li {
      padding: 8px 0;
      position: relative;
      padding-left: 25px;
    }
    
    .values-list li:before {
      content: "✓";
      color: var(--success-color);
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .stat-item {
      padding: 20px;
    }
    
    .stat-item h3 {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .team-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .team-card:hover {
      transform: translateY(-5px);
    }
    
    .team-avatar {
      margin-bottom: 20px;
    }
    
    .certification-card {
      background: white;
      padding: 30px 20px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .certification-card:hover {
      transform: translateY(-5px);
    }
    
    .cta-section {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%);
    }
    
    .cta-buttons {
      margin-top: 30px;
    }
  `]
})
export class AboutComponent {}
