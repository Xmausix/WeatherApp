import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { GeolocationService } from '../../core/services/geolocation.service';
import { WeatherService } from '../../core/services/weather.service';
import { GeoLocation } from '../../core/models/weather.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, SearchInputComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 transition-colors duration-300">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl border-b border-secondary-100/50 dark:border-secondary-800/50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-14">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
              </div>
              <span class="text-base font-semibold text-secondary-800 dark:text-white hidden sm:block">WeatherNow</span>
            </a>

            <!-- Search Bar (Desktop) -->
            <div class="hidden md:block flex-1 max-w-sm mx-8">
              <app-search-input
                (citySelected)="onCitySelected($event)"
              />
            </div>

            <!-- Right Side Actions -->
            <div class="flex items-center gap-2">
              <!-- Location Button -->
              <button
                (click)="useCurrentLocation()"
                class="h-10 px-3 rounded-xl bg-secondary-100/80 dark:bg-secondary-800/80 border border-secondary-200/50 dark:border-secondary-700/50 hover:bg-secondary-200/80 dark:hover:bg-secondary-700/80 transition-all duration-200 flex items-center gap-2"
                [disabled]="geoLoading()"
                [class.opacity-50]="geoLoading()"
              >
                @if (geoLoading()) {
                  <svg class="w-4 h-4 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  <svg class="w-4 h-4 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                }
                <span class="hidden lg:block text-sm font-medium text-secondary-600 dark:text-secondary-300">Location</span>
              </button>

              <!-- Theme Toggle -->
              <app-theme-toggle />
            </div>
          </div>

          <!-- Mobile Search -->
          <div class="md:hidden pb-3">
            <app-search-input
              (citySelected)="onCitySelected($event)"
              placeholder="Search city..."
            />
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="py-4 border-t border-secondary-100/50 dark:border-secondary-800/50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <p class="text-center text-xs text-secondary-400 dark:text-secondary-500">
            Weather data from OpenWeatherMap
          </p>
        </div>
      </footer>
    </div>
  `,
})
export class MainLayoutComponent {
  private storageService = inject(StorageService);
  private geolocationService = inject(GeolocationService);
  private weatherService = inject(WeatherService);

  geoLoading = this.geolocationService.loading;

  onCitySelected(city: GeoLocation): void {
    this.weatherService.getWeatherByCoords(city.lat, city.lon).subscribe();
  }

  useCurrentLocation(): void {
    this.geolocationService.getCurrentPosition().subscribe(location => {
      if (location) {
        this.weatherService.getWeatherByCoords(location.lat, location.lon).subscribe();
      }
    });
  }
}
