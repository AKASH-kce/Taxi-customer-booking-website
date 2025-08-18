import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center">
            <h1>Contact Us</h1>
            <p>Get in touch with us for any queries or support</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="contact-info py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="contact-card text-center">
              <div class="contact-icon">
                <i class="fas fa-phone fa-3x text-primary"></i>
              </div>
              <h4>Call Us</h4>
              <p>+91 98765 43210</p>
              <a href="tel:+919876543210" class="btn btn-primary">Call Now</a>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="contact-card text-center">
              <div class="contact-icon">
                <i class="fab fa-whatsapp fa-3x text-success"></i>
              </div>
              <h4>WhatsApp</h4>
              <p>+91 98765 43210</p>
              <a href="https://wa.me/919876543210" target="_blank" class="btn btn-success">Chat Now</a>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="contact-card text-center">
              <div class="contact-icon">
                <i class="fas fa-envelope fa-3x text-info"></i>
              </div>
              <h4>Email Us</h4>
              <p>info@vkdrop.com</p>
              <a href="mailto:info@vkdrop.com" class="btn btn-info">Send Email</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="contact-form py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-body p-4">
                <h3 class="text-center mb-4">Send us a Message</h3>
                
                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Name *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        formControlName="name"
                        placeholder="Enter your name"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Phone *</label>
                      <input 
                        type="tel" 
                        class="form-control" 
                        formControlName="phone"
                        placeholder="Enter your phone number"
                      >
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label">Email</label>
                      <input 
                        type="email" 
                        class="form-control" 
                        formControlName="email"
                        placeholder="Enter your email"
                      >
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label">Subject *</label>
                      <select class="form-select" formControlName="subject">
                        <option value="">Select Subject</option>
                        <option value="booking">Booking Enquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="complaint">Complaint</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div class="col-12 mb-3">
                      <label class="form-label">Message *</label>
                      <textarea 
                        class="form-control" 
                        rows="5" 
                        formControlName="message"
                        placeholder="Enter your message"
                      ></textarea>
                    </div>
                    <div class="col-12 text-center">
                      <button 
                        type="submit" 
                        class="btn btn-primary btn-lg"
                        [disabled]="contactForm.invalid || isSubmitting"
                      >
                        <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Office Location -->
    <section class="office-location py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Our Office</h2>
            <p class="text-muted">Visit us at our office</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="office-card">
              <h4><i class="fas fa-map-marker-alt text-primary"></i> Office Address</h4>
              <p>VK Drop Taxi Pvt Ltd<br>
              123, Main Street<br>
              Mumbai, Maharashtra 400001<br>
              India</p>
              <h5>Business Hours</h5>
              <p>Monday - Sunday: 24/7<br>
              Customer Support: 24/7</p>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="map-container">
              <div class="map-placeholder">
                <i class="fas fa-map fa-4x text-muted"></i>
                <p>Google Maps Integration</p>
                <small>Map will be displayed here</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Media -->
    <section class="social-media py-5 bg-primary text-white">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center mb-5">
            <h2>Follow Us</h2>
            <p class="lead">Stay connected with us on social media</p>
          </div>
        </div>
        <div class="row">
          <div class="col-md-3 mb-4 text-center">
            <a href="#" class="social-link">
              <i class="fab fa-facebook fa-3x mb-3"></i>
              <h5>Facebook</h5>
            </a>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <a href="#" class="social-link">
              <i class="fab fa-twitter fa-3x mb-3"></i>
              <h5>Twitter</h5>
            </a>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <a href="#" class="social-link">
              <i class="fab fa-instagram fa-3x mb-3"></i>
              <h5>Instagram</h5>
            </a>
          </div>
          <div class="col-md-3 mb-4 text-center">
            <a href="#" class="social-link">
              <i class="fab fa-linkedin fa-3x mb-3"></i>
              <h5>LinkedIn</h5>
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-info {
      background: white;
    }
    
    .contact-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
      height: 100%;
    }
    
    .contact-card:hover {
      transform: translateY(-5px);
    }
    
    .contact-icon {
      margin-bottom: 20px;
    }
    
    .contact-form {
      background: var(--light-color);
    }
    
    .office-card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      height: 100%;
    }
    
    .map-container {
      height: 300px;
    }
    
    .map-placeholder {
      background: white;
      border-radius: 15px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .social-link {
      color: white;
      text-decoration: none;
      display: block;
      transition: transform 0.3s ease;
    }
    
    .social-link:hover {
      color: white;
      transform: translateY(-5px);
    }
  `]
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Thank you for your message! We will get back to you soon.');
        this.contactForm.reset();
      }, 2000);
    }
  }
}
