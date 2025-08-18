import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private readonly nominatimBase = 'https://nominatim.openstreetmap.org';
  private readonly osrmBase = 'https://router.project-osrm.org';

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
      const url = `${this.nominatimBase}/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
      fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(res => res.json())
        .then((results: any[]) => {
          if (results && results.length > 0) {
            const r = results[0];
            const loc: Location = {
              lat: parseFloat(r.lat),
              lng: parseFloat(r.lon),
              address: r.display_name
            };
            observer.next(loc);
            observer.complete();
          } else {
            observer.error('No results from Nominatim');
          }
        })
        .catch(err => observer.error(err));
    });
  }

  // Reverse geocode coordinates to address
  reverseGeocode(lat: number, lng: number): Observable<string> {
    return new Observable(observer => {
      const url = `${this.nominatimBase}/reverse?format=json&lat=${lat}&lon=${lng}`;
      fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(res => res.json())
        .then((result: any) => {
          if (result && result.display_name) {
            observer.next(result.display_name);
            observer.complete();
          } else {
            observer.error('Reverse geocoding failed');
          }
        })
        .catch(err => observer.error(err));
    });
  }

  // Get route information between two locations
  getRouteInfo(origin: Location, destination: Location): Observable<RouteInfo> {
    return new Observable(observer => {
      const url = `${this.osrmBase}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false&alternatives=false&steps=false`;
      fetch(url)
        .then(res => res.json())
        .then((json: any) => {
          if (json && json.code === 'Ok' && json.routes && json.routes[0]) {
            const r = json.routes[0];
            const routeInfo: RouteInfo = {
              distance: (r.distance || 0) / 1000,
              duration: (r.duration || 0) / 60,
              polyline: []
            };
            observer.next(routeInfo);
            observer.complete();
          } else {
            observer.error('OSRM routing failed');
          }
        })
        .catch(err => observer.error(err));
    });
  }

  // Get place predictions for autocomplete
  getPlacePredictions(input: string): Observable<any[]> {
    return new Observable(observer => {
      const url = `${this.nominatimBase}/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(input)}`;
      fetch(url, { headers: { 'Accept-Language': 'en' } })
        .then(res => res.json())
        .then((results: any[]) => {
          const mapped = (results || []).map(r => ({
            description: r.display_name,
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
            structured_formatting: {
              main_text: r.address?.road || r.address?.neighbourhood || r.address?.suburb || r.address?.city || r.address?.town || r.address?.village || 'Location',
              secondary_text: r.display_name
            }
          }));
          observer.next(mapped);
          observer.complete();
        })
        .catch(() => {
          observer.next([]);
          observer.complete();
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

  // No-op: kept for backward compatibility when switching from Google Maps
  loadGoogleMapsScript(_apiKey: string): Promise<void> {
    return Promise.resolve();
  }
}
