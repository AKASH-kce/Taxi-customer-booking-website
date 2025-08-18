import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MapService, Location } from '../../services/map.service';
import { BookingService } from '../../services/booking.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-fare-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './fare-estimator.component.html',
  styleUrls: ['./fare-estimator.component.scss']
})
export class FareEstimatorComponent implements OnInit, OnDestroy {
  fareForm: FormGroup;
  isCalculating = false;
  fareResult: any = null;
  currentLocation: Location | null = null;
  fromPredictions: any[] = [];
  toPredictions: any[] = [];
  private destroy$ = new Subject<void>();
  showFromMap = false;
  showToMap = false;
  private fromLeafletMap: L.Map | null = null;
  private toLeafletMap: L.Map | null = null;

  vehicleTypes = [
    {
      id: 'hatchback',
      name: 'Hatchback',
      type: 'sedan',
      baseFare: 10,
      perKmRate: 12,
      perHourRate: 100,
      capacity: 4,
      icon: 'fas fa-car fa-3x',
      description: 'Economical hatchback for city travel'
    },
    {
      id: 'sedan',
      name: 'Sedan',
      type: 'sedan',
      baseFare: 15,
      perKmRate: 15,
      perHourRate: 120,
      capacity: 4,
      icon: 'fas fa-car fa-3x',
      description: 'Comfortable sedan for business travel'
    },
    {
      id: 'suv',
      name: 'SUV',
      type: 'suv',
      baseFare: 20,
      perKmRate: 18,
      perHourRate: 150,
      capacity: 6,
      icon: 'fas fa-car fa-3x',
      description: 'Spacious SUV for family travel'
    },
    {
      id: 'luxury',
      name: 'Luxury',
      type: 'luxury',
      baseFare: 30,
      perKmRate: 25,
      perHourRate: 200,
      capacity: 4,
      icon: 'fas fa-car fa-3x',
      description: 'Premium luxury vehicle for special occasions'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    private bookingService: BookingService
  ) {
    this.fareForm = this.fb.group({
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      vehicleType: ['', Validators.required],
      tripType: ['', Validators.required],
      distance: ['']
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormListeners(): void {
    // Listen for from location changes
    this.fareForm.get('fromLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.getPlacePredictions(value, 'from');
        } else {
          this.fromPredictions = [];
        }
      });

    // Listen for to location changes
    this.fareForm.get('toLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length > 2) {
          this.getPlacePredictions(value, 'to');
        } else {
          this.toPredictions = [];
        }
      });
  }

  getCurrentLocation(): void {
    this.mapService.getCurrentLocation().subscribe({
      next: (location) => {
        this.currentLocation = location;
        this.fareForm.patchValue({
          fromLocation: location.address
        });
      },
      error: (error) => {
        console.error('Failed to get current location:', error);
        alert('Unable to get your current location. Please enter manually.');
      }
    });
  }

  private getPlacePredictions(input: string, type: 'from' | 'to'): void {
    this.mapService.getPlacePredictions(input).subscribe({
      next: (predictions) => {
        if (type === 'from') {
          this.fromPredictions = predictions;
        } else {
          this.toPredictions = predictions;
        }
      },
      error: (error) => {
        console.error('Failed to get place predictions:', error);
      }
    });
  }

  selectPlacePrediction(prediction: any, type: 'from' | 'to'): void {
    if (type === 'from') {
      this.fareForm.patchValue({ fromLocation: prediction.description });
      this.fromPredictions = [];
    } else {
      this.fareForm.patchValue({ toLocation: prediction.description });
      this.toPredictions = [];
    }
  }

  toggleFromMap(): void {
    this.showFromMap = !this.showFromMap;
    setTimeout(() => {
      if (this.showFromMap && !this.fromLeafletMap) {
        this.fromLeafletMap = this.initLeafletMap('fromMapContainer', (lat, lng) => {
          this.mapService.reverseGeocode(lat, lng).subscribe({
            next: addr => this.fareForm.patchValue({ fromLocation: addr }),
            error: () => this.fareForm.patchValue({ fromLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })
          });
        });
      }
      this.fromLeafletMap?.invalidateSize();
    });
  }

  toggleToMap(): void {
    this.showToMap = !this.showToMap;
    setTimeout(() => {
      if (this.showToMap && !this.toLeafletMap) {
        this.toLeafletMap = this.initLeafletMap('toMapContainer', (lat, lng) => {
          this.mapService.reverseGeocode(lat, lng).subscribe({
            next: addr => this.fareForm.patchValue({ toLocation: addr }),
            error: () => this.fareForm.patchValue({ toLocation: `${lat.toFixed(6)}, ${lng.toFixed(6)}` })
          });
        });
      }
      this.toLeafletMap?.invalidateSize();
    });
  }

  private initLeafletMap(containerId: string, onPick: (lat: number, lng: number) => void): L.Map {
    const map = L.map(containerId).setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    let marker: L.CircleMarker | null = null;
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();
      marker = L.circleMarker([lat, lng], { radius: 8, color: '#007bff', fillColor: '#007bff', fillOpacity: 0.6 }).addTo(map);
      onPick(lat, lng);
    });
    return map;
  }

  calculateFare(): void {
    if (this.fareForm.valid) {
      this.isCalculating = true;
      
      const formValue = this.fareForm.value;
      
      this.bookingService.estimateFare(
        formValue.fromLocation,
        formValue.toLocation,
        formValue.vehicleType,
        formValue.tripType
      ).subscribe({
        next: (estimate) => {
          this.fareResult = {
            fromLocation: formValue.fromLocation,
            toLocation: formValue.toLocation,
            distance: estimate.distance,
            duration: estimate.duration,
            vehicleName: estimate.vehicleType,
            tripType: formValue.tripType,
            baseFare: estimate.baseFare,
            distanceFare: estimate.distanceFare,
            timeFare: estimate.timeFare,
            tollCharges: this.calculateTollCharges(estimate.distance, formValue.tripType),
            nightCharges: this.calculateNightCharges(),
            totalFare: estimate.totalFare
          };
          this.isCalculating = false;
        },
        error: (error) => {
          console.error('Failed to calculate fare:', error);
          this.isCalculating = false;
          // Fallback to simple calculation
          this.calculateSimpleFare(formValue);
        }
      });
    }
  }

  private calculateSimpleFare(formValue: any): void {
    const selectedVehicle = this.vehicleTypes.find(v => v.id === formValue.vehicleType);
    
    if (selectedVehicle) {
      const distance = formValue.distance || this.estimateDistance(formValue.fromLocation, formValue.toLocation);
      const baseFare = selectedVehicle.baseFare;
      const distanceFare = distance * selectedVehicle.perKmRate;
      const tollCharges = this.calculateTollCharges(distance, formValue.tripType);
      const nightCharges = this.calculateNightCharges();
      const totalFare = baseFare + distanceFare + tollCharges + nightCharges;

      this.fareResult = {
        fromLocation: formValue.fromLocation,
        toLocation: formValue.toLocation,
        distance: distance,
        duration: Math.round((distance / 30) * 60), // Assuming 30 km/h
        vehicleName: selectedVehicle.name,
        tripType: formValue.tripType,
        baseFare: baseFare,
        distanceFare: distanceFare,
        tollCharges: tollCharges,
        nightCharges: nightCharges,
        totalFare: totalFare
      };
    }
  }

  private estimateDistance(from: string, to: string): number {
    const commonDistances: { [key: string]: number } = {
      'mumbai to pune': 148,
      'mumbai to lonavala': 83,
      'mumbai to alibaug': 95,
      'mumbai to goa': 590,
      'mumbai to nashik': 180,
      'mumbai to aurangabad': 330
    };
    
    const route = `${from.toLowerCase()} to ${to.toLowerCase()}`;
    return commonDistances[route] || Math.floor(Math.random() * 50) + 10;
  }

  private calculateTollCharges(distance: number, tripType: string): number {
    if (tripType === 'outstation' && distance > 100) {
      return Math.floor(distance / 50) * 50;
    }
    return 0;
  }

  private calculateNightCharges(): number {
    const currentHour = new Date().getHours();
    if (currentHour >= 22 || currentHour <= 6) {
      return 50;
    }
    return 0;
  }
}
