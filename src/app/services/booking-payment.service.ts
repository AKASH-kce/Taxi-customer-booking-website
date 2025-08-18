import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingPaymentService {
  getUPILink(bookingId:string,amount:number):string{
    const upiID='akashkce123@okicici';
    const name='Taxi service';
    const note=`payment for booking ${bookingId}`;

    return `upi://pay?pa=${upiID}&pn=${encodeURIComponent(name)}&tn=${encodeURIComponent(note)}&am=${amount}&cu=INR`;

  }
  
}
