import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'https://my-dotnet-api-yte3.onrender.com/api/Email/send'; // your backend URL

  constructor(private http: HttpClient) {}

  sendBookingEmail(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
