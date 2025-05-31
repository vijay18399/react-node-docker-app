import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/profile.model';
import { profile } from '../data/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private user: User = profile;

  constructor() {}

  getProfile(): Observable<User> {
    // In a real app, this would be an HTTP call
    return of(this.user);
  }

  saveProfile(updatedProfile: User): Observable<User> {
    // In a real app, this would be an HTTP call
    this.user = updatedProfile;
    return of(this.user);
  }
}

