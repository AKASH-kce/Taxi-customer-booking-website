import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  private map: any;
  private autocompleteService: any;
  private placesService: any;
  private directionsService: any;
  private geocoder: any;
  private isLoaded = false;

  constructor() {
    this.loadGoogleMapsAPI();
  }

  // Load Google Maps API
  private loadGoogleMapsAPI(): void {
    if (typeof google !== 'undefined' && google.maps) {
      this.initializeServices();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeServices();
    };
    document.head.appendChild(script);
  }

  // Initialize Google Maps services
  private initializeServices(): void {
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
    this.directionsService = new google.maps.DirectionsService();
    this.geocoder = new google.maps.Geocoder();
    this.isLoaded = true;
  }

  // Get place predictions for autocomplete
  getPlacePredictions(input: string): Observable<any[]> {
    if (!this.isLoaded || !input.trim()) {
      return of([]);
    }

    return from(new Promise<any[]>((resolve, reject) => {
      this.autocompleteService.getPlacePredictions(
        {
          input: input,
          componentRestrictions: { country: 'IN' }, // Restrict to India
          types: ['establishment', 'geocode']
        },
        (predictions: any[], status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(predictions);
          } else {
            resolve([]);
          }
        }
      );
    }));
  }

  // Get place details
  getPlaceDetails(placeId: string): Observable<any> {
    if (!this.isLoaded) {
      return of(null);
    }

    return from(new Promise<any>((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId: placeId,
          fields: ['name', 'formatted_address', 'geometry', 'place_id']
        },
        (place: any, status: any) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(place);
          } else {
            resolve(null);
          }
        }
      );
    }));
  }

  // Calculate route and distance
  calculateRoute(origin: string, destination: string): Observable<any> {
    if (!this.isLoaded) {
      return of(null);
    }

    return from(new Promise<any>((resolve, reject) => {
      this.directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC
        },
        (result: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const route = result.routes[0];
            const leg = route.legs[0];
            
            resolve({
              distance: leg.distance.text,
              distanceValue: leg.distance.value,
              duration: leg.duration.text,
              durationValue: leg.duration.value,
              startAddress: leg.start_address,
              endAddress: leg.end_address,
              steps: leg.steps
            });
          } else {
            resolve(null);
          }
        }
      );
    }));
  }

  // Geocode address to coordinates
  geocodeAddress(address: string): Observable<any> {
    if (!this.isLoaded) {
      return of(null);
    }

    return from(new Promise<any>((resolve, reject) => {
      this.geocoder.geocode(
        { address: address },
        (results: any[], status: any) => {
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address
            });
          } else {
            resolve(null);
          }
        }
      );
    }));
  }

  // Initialize map
  initializeMap(element: HTMLElement, center: { lat: number; lng: number }): Observable<any> {
    if (!this.isLoaded) {
      return of(null);
    }

    return from(new Promise<any>((resolve, reject) => {
      this.map = new google.maps.Map(element, {
        center: center,
        zoom: 12,
        styles: this.getMapStyles(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });

      resolve(this.map);
    }));
  }

  // Add marker to map
  addMarker(position: { lat: number; lng: number }, title?: string): any {
    if (!this.map) return null;

    return new google.maps.Marker({
      position: position,
      map: this.map,
      title: title || '',
      animation: google.maps.Animation.DROP
    });
  }

  // Draw route on map
  drawRoute(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Observable<any> {
    if (!this.isLoaded || !this.map) {
      return of(null);
    }

    return from(new Promise<any>((resolve, reject) => {
      this.directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result: any, status: any) => {
          if (status === google.maps.DirectionsStatus.OK) {
            const directionsRenderer = new google.maps.DirectionsRenderer({
              map: this.map,
              directions: result,
              suppressMarkers: true
            });

            // Add custom markers
            new google.maps.Marker({
              position: origin,
              map: this.map,
              title: 'Pickup Location',
              icon: {
                url: 'assets/images/pickup-marker.png',
                scaledSize: new google.maps.Size(32, 32)
              }
            });

            new google.maps.Marker({
              position: destination,
              map: this.map,
              title: 'Drop Location',
              icon: {
                url: 'assets/images/drop-marker.png',
                scaledSize: new google.maps.Size(32, 32)
              }
            });

            resolve(directionsRenderer);
          } else {
            resolve(null);
          }
        }
      );
    }));
  }

  // Custom map styles
  private getMapStyles(): any[] {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ];
  }

  // Check if API is loaded
  isAPILoaded(): boolean {
    return this.isLoaded;
  }
}
