import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../core/services/weather.service';
import { StorageService } from '../../core/services/storage.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { CurrentWeatherComponent } from '../weather/current-weather/current-weather.component';
import { HourlyForecastComponent } from '../weather/hourly-forecast/hourly-forecast.component';
import { DailyForecastComponent } from '../forecast/daily-forecast/daily-forecast.component';
import { AdditionalInfoComponent } from '../weather/additional-info/additional-info.component';
import { WeatherStatsComponent } from '../weather/weather-stats/weather-stats.component';
import { FavoritesComponent } from '../favorites/favorites.component';
import { HistoryComponent } from '../history/history.component';
import { PopularCitiesComponent, PopularCity } from './popular-cities/popular-cities.component';
import { WeatherSkeletonComponent } from '../weather/weather-skeleton/weather-skeleton.component';
import { SearchHistoryItem, FavoriteCity } from '../../core/models/weather.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    DailyForecastComponent,
    AdditionalInfoComponent,
    WeatherStatsComponent,
    FavoritesComponent,
    HistoryComponent,
    PopularCitiesComponent,
    WeatherSkeletonComponent,
  ],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
      <!-- Main Content Area -->
      <div class="lg:col-span-3 space-y-5">
        @if (loading()) {
          <app-weather-skeleton />
        } @else if (error()) {
          <div class="p-6 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30 text-center">
            <svg class="w-10 h-10 mx-auto mb-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h3 class="text-base font-medium text-secondary-800 dark:text-white mb-1">Unable to Load Weather</h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-4">{{ error() }}</p>
            <button
              (click)="clearError()"
              class="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        } @else if (currentWeather()) {
          <!-- Current Weather -->
          <app-current-weather [weather]="currentWeather()!" />

          <!-- Hourly Forecast -->
          <app-hourly-forecast [hourly]="hourlyForecast()" />

          <!-- Daily Forecast -->
          <app-daily-forecast [daily]="dailyForecast()" />

          <!-- Additional Info -->
          <app-additional-info
            [weather]="currentWeather()"
            [uv]="uvIndex()"
            [airQuality]="airQuality()"
          />

          <!-- Temperature Chart -->
          <app-weather-stats [hourly]="hourlyForecast()" />
        } @else {
          <!-- Welcome State -->
          <div class="p-8 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
            </div>
            <h2 class="text-lg font-semibold text-secondary-800 dark:text-white mb-2">Welcome to WeatherNow</h2>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-5 max-w-sm mx-auto">
              Search for a city above or use your current location to get weather information.
            </p>
            <button
              (click)="useCurrentLocation()"
              class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Use My Location
            </button>
          </div>

          <!-- Popular Cities -->
          <app-popular-cities (onCitySelected)="onPopularCitySelected($event)" />
        }
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-4">
        <div class="p-4 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30">
          <app-favorites (onCitySelected)="onFavoriteSelected($event)" />
        </div>
        <div class="p-4 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30">
          <app-history (onCitySelected)="onHistorySelected($event)" />
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private weatherService = inject(WeatherService);
  private storageService = inject(StorageService);
  private geolocationService = inject(GeolocationService);

  loading = this.weatherService.loading;
  error = this.weatherService.error;
  currentWeather = this.weatherService.currentWeather;
  hourlyForecast = this.weatherService.hourlyForecast;
  dailyForecast = this.weatherService.dailyForecast;
  uvIndex = this.weatherService.uvIndex;
  airQuality = this.weatherService.airQuality;

  onPopularCitySelected(city: PopularCity): void {
    this.loadWeatherForCity(city.name, city.lat, city.lon, city.country);
  }

  onFavoriteSelected(city: FavoriteCity): void {
    this.loadWeatherForCity(city.name, city.lat, city.lon, city.country);
  }

  onHistorySelected(item: SearchHistoryItem): void {
    this.loadWeatherForCity(item.name, item.lat, item.lon, item.country);
  }

  useCurrentLocation(): void {
    this.geolocationService.getCurrentPosition().subscribe(location => {
      if (location) {
        this.weatherService.getWeatherByCoords(location.lat, location.lon).subscribe(() => {
          this.addToHistory('Current Location', location.lat, location.lon, 'Local');
        });
      }
    });
  }

  private loadWeatherForCity(name: string, lat: number, lon: number, country: string): void {
    this.weatherService.getWeatherByCoords(lat, lon).subscribe(() => {
      this.addToHistory(name, lat, lon, country);
    });
  }

  private addToHistory(name: string, lat: number, lon: number, country: string): void {
    this.storageService.addToSearchHistory({
      name,
      country,
      lat,
      lon,
      timestamp: Date.now(),
    });
  }

  clearError(): void {
    this.weatherService.clearError();
  }
}
