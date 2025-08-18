import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  polyline: any[];
}

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private geocoder: any = null;
  private directionsService: any = null;
  private autocompleteService: any = null;

  constructor() {
    this.initializeGoogleMaps();
  }

  private initializeGoogleMaps(): void {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      this.geocoder = new window.google.maps.Geocoder();
      this.directionsService = new window.google.maps.DirectionsService();
      this.autocompleteService = new window.google.maps.places.AutocompleteService();
    }
  }

  // Get current location using browser geolocation
  getCurrentLocation(): Observable<Location> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: ''
          };

          // Reverse geocode to get address
          this.reverseGeocode(location.lat, location.lng).subscribe({
            next: (address) => {
              location.address = address;
              observer.next(location);
              observer.complete();
            },
            error: (error) => {
              location.address = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
              observer.next(location);
              observer.complete();
            }
          });
        },
        (error) => {
          observer.error('Unable to retrieve your location: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Geocode address to coordinates
  geocodeAddress(address: string): Observable<Location> {
    return new Observable(observer => {
      if (!this.geocoder) {
        observer.error('Google Maps not loaded');
        return;
      }

      this.geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const locationData: Location = {
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          };
          observer.next(locationData);
          observer.complete();
        } else {
          observer.error('Geocoding failed: ' + status);
        }
      });
    });
  }

  // Reverse geocode coordinates to address
  reverseGeocode(lat: number, lng: number): Observable<string> {
    return new Observable(observer => {
      if (!this.geocoder) {
        observer.error('Google Maps not loaded');
        return;
      }

      this.geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results && results[0]) {
          observer.next(results[0].formatted_address);
          observer.complete();
        } else {
          observer.error('Reverse geocoding failed: ' + status);
        }
      });
    });
  }

  // Get route information between two locations
  getRouteInfo(origin: Location, destination: Location): Observable<RouteInfo> {
    return new Observable(observer => {
      if (!this.directionsService) {
        observer.error('Google Maps not loaded');
        return;
      }

      const request = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === 'OK' && result) {
          const route = result.routes[0];
          const leg = route.legs[0];
          
          const routeInfo: RouteInfo = {
            distance: leg.distance.value / 1000, // Convert meters to kilometers
            duration: leg.duration.value / 60, // Convert seconds to minutes
            polyline: this.decodePolyline(route.overview_polyline.encoded)
          };
          
          observer.next(routeInfo);
          observer.complete();
        } else {
          observer.error('Directions request failed: ' + status);
        }
      });
    });
  }

  // Get place predictions for autocomplete
  getPlacePredictions(input: string): Observable<any[]> {
    return new Observable(observer => {
      if (!this.autocompleteService) {
        observer.error('Google Maps not loaded');
        return;
      }

      this.autocompleteService.getPlacePredictions({
        input,
        componentRestrictions: { country: 'IN' }, // Restrict to India
        types: ['geocode', 'establishment']
      }, (predictions: any, status: any) => {
        if (status === 'OK' && predictions) {
          observer.next(predictions);
          observer.complete();
        } else {
          observer.next([]);
          observer.complete();
        }
      });
    });
  }

  // Calculate distance between two points using Haversine formula (fallback)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Decode Google's polyline encoding
  private decodePolyline(encoded: string): any[] {
    const poly: any[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let shift = 0, result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      if (window.google && window.google.maps) {
        poly.push(new window.google.maps.LatLng(lat / 1E5, lng / 1E5));
      } else {
        poly.push({ lat: lat / 1E5, lng: lng / 1E5 });
      }
    }

    return poly;
  }

  // Load Google Maps script
  loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.google && window.google.maps) {
        this.initializeGoogleMaps();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.initializeGoogleMaps();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps'));
      };

      document.head.appendChild(script);
    });
  }
}
