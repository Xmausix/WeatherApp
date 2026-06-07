import { Injectable, signal } from '@angular/core';
import { from, Observable, of, catchError, map } from 'rxjs';

export interface UserLocation {
  lat: number;
  lon: number;
  accuracy?: number;
}

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentLocation = signal<UserLocation | null>(null);
  readonly permissionStatus = signal<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  getCurrentPosition(): Observable<UserLocation | null> {
    if (!navigator.geolocation) {
      this.error.set('Geolocation is not supported by your browser.');
      return of(null);
    }

    this.loading.set(true);
    this.error.set(null);

    return from(
      new Promise<UserLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          error => {
            let message = 'Unable to get your location.';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                message = 'Location permission denied. Please enable location access.';
                this.permissionStatus.set('denied');
                break;
              case error.POSITION_UNAVAILABLE:
                message = 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                message = 'Location request timed out.';
                break;
            }
            reject(new Error(message));
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      })
    ).pipe(
      map(location => {
        this.currentLocation.set(location);
        this.loading.set(false);
        this.permissionStatus.set('granted');
        return location;
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set(err.message);
        return of(null);
      })
    );
  }

  checkPermission(): Promise<'granted' | 'denied' | 'prompt' | 'unknown'> {
    if (!navigator.permissions) {
      return Promise.resolve('unknown');
    }

    return navigator.permissions
      .query({ name: 'geolocation' })
      .then(result => {
        this.permissionStatus.set(result.state);
        return result.state;
      })
      .catch(() => 'unknown');
  }

  clearError(): void {
    this.error.set(null);
  }
}
