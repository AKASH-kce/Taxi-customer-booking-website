export interface Booking {
  id?: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupLocation: string;
  pickupLatLng?: { lat: number; lng: number };
  dropLocation: string;
  dropLatLng?: { lat: number; lng: number };
  tripType: 'local' | 'outstation' | 'hourly';
  tripMode: 'oneway' | 'roundtrip';
  vehicleType: 'sedan' | 'suv' | 'tempo' | 'luxury';
  date: string;
  time: string;
  estimatedFare: number;
  actualFare?: number;
  status: 'pending' | 'accepted' | 'assigned' | 'completed' | 'cancelled';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  bookingDate: Date;
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'partial';
  paymentMethod?: 'cash' | 'online' | 'upi';
  createdAt: Date;
  updatedAt: Date;
}

export interface FareEstimate {
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  totalFare: number;
  vehicleType: string;
  tripType: string;
}

export interface VehicleType {
  id: string;
  name: string;
  type: 'sedan' | 'suv' | 'tempo' | 'luxury';
  baseFare: number;
  perKmRate: number;
  perHourRate: number;
  capacity: number;
  image: string;
  description: string;
  features: string[];
}

export interface TripPackage {
  id: string;
  name: string;
  type: 'local' | 'outstation' | 'hourly';
  duration: string;
  distance: string;
  price: number;
  description: string;
  features: string[];
  image: string;
  popular?: boolean;
}
