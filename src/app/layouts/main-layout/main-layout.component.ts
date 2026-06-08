import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { ThemeToggleComponent } from '../../shared/components';
import { SearchInputComponent } from '../../shared/components';
import { GeolocationService } from '../../core/services/geolocation.service';
import { WeatherService } from '../../core/services/weather.service';
import { GeoLocation } from '../../core/models/weather.models';

// === KOMPONENTY REKLAM (odporne na AdBlock) ===
import { GoogleAdBannerComponent } from '../../shared/components/ads/google-ad-banner.component';
import { GoogleAdSidebarComponent } from '../../shared/components/ads/google-ad-sidebar.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ThemeToggleComponent,
        SearchInputComponent,
        GoogleAdBannerComponent,
        GoogleAdSidebarComponent
    ],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 
                dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 
                transition-colors duration-300">

      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white/70 dark:bg-secondary-900/70 backdrop-blur-xl 
                     border-b border-secondary-100/50 dark:border-secondary-800/50">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-14">
            
            <!-- Logo -->
            <a routerLink="/" class="flex items-center gap-2.5 group">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                </svg>
              </div>
              <span class="text-base font-semibold text-secondary-800 dark:text-white hidden sm:block">
                WeatherNow
              </span>
            </a>

            <!-- Search Bar (Desktop) -->
            <div class="hidden md:block flex-1 max-w-sm mx-8">
              <app-search-input (citySelected)="onCitySelected($event)" />
            </div>

            <!-- Right Side Actions -->
            <div class="flex items-center gap-2">
              <!-- Location Button -->
              <button
                (click)="useCurrentLocation()"
                class="h-10 px-3 rounded-xl bg-secondary-100/80 dark:bg-secondary-800/80 
                       border border-secondary-200/50 dark:border-secondary-700/50 
                       hover:bg-secondary-200/80 dark:hover:bg-secondary-700/80 
                       transition-all duration-200 flex items-center gap-2"
                [disabled]="geoLoading()"
                [class.opacity-50]="geoLoading()">
                
                @if (geoLoading()) {
                  <svg class="w-4 h-4 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                } @else {
                  <svg class="w-4 h-4 text-secondary-500 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                }
                <span class="hidden lg:block text-sm font-medium text-secondary-600 dark:text-secondary-300">
                  Location
                </span>
              </button>

              <app-theme-toggle />
            </div>
          </div>

          <!-- Mobile Search -->
          <div class="md:hidden pb-3">
            <app-search-input (citySelected)="onCitySelected($event)" placeholder="Search city..." />
          </div>
        </div>
      </header>

      <!-- === REKLAMA BANNER (góra) - znika przy AdBlocku === -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <app-google-ad-banner 
          adClient="ca-pub-TWOJ_ID" 
          adSlot="1234567890" />
      </div>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Główna treść -->
          <div class="lg:col-span-8">
            <router-outlet></router-outlet>
          </div>

          <!-- Sidebar z reklamą -->
          <div class="lg:col-span-4 hidden lg:block">
            <div class="sticky top-20 space-y-6">
              <app-google-ad-sidebar 
                adClient="ca-pub-TWOJ_ID" 
                adSlot="9876543210" />
            </div>
          </div>
          
        </div>
      </main>

      <!-- === REKLAMA BANNER (dół) - znika przy AdBlocku === -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <app-google-ad-banner 
          adClient="ca-pub-TWOJ_ID" 
          adSlot="1122334455" />
      </div>

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