import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '../../../shared/components/weather-icon/weather-icon.component';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { CurrentWeather } from '../../../core/models/weather.models';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, WeatherIconComponent, GlassCardComponent],
  template: `
    <app-glass-card class="overflow-hidden">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <!-- Left: Location & Main Weather -->
        <div class="flex-1">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-2xl font-semibold text-secondary-800 dark:text-white">
                {{ weather()?.name }}
              </h1>
              <p class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
                {{ weather()?.sys?.country }}
              </p>
            </div>
            <button
              (click)="toggleFavorite()"
              class="p-2 rounded-lg transition-all duration-200 hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50"
              [class.text-amber-500]="isFavorite()"
              [class.text-secondary-400]="!isFavorite()"
              [attr.aria-label]="isFavorite() ? 'Remove from favorites' : 'Add to favorites'"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                @if (isFavorite()) {
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                } @else {
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                }
              </svg>
            </button>
          </div>

          <div class="flex items-baseline gap-3 mb-2">
            <span class="text-6xl md:text-7xl font-extralight text-secondary-800 dark:text-white tracking-tight">
              {{ temperature() }}
            </span>
            <span class="text-2xl font-light text-secondary-400">°C</span>
          </div>

          <div class="flex items-center gap-2">
            <app-weather-icon [iconCode]="weather()?.weather?.[0]?.icon ?? ''" size="sm" />
            <span class="text-secondary-600 dark:text-secondary-300 capitalize">
              {{ weather()?.weather?.[0]?.description }}
            </span>
          </div>
        </div>

        <!-- Right: Stats Grid -->
        <div class="grid grid-cols-2 gap-3 md:w-64">
          <div class="px-3 py-2.5 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/50">
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Feels like</p>
            <p class="text-base font-medium text-secondary-800 dark:text-white">{{ feelsLike() }}°</p>
          </div>

          <div class="px-3 py-2.5 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/50">
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Humidity</p>
            <p class="text-base font-medium text-secondary-800 dark:text-white">{{ weather()?.main?.humidity }}%</p>
          </div>

          <div class="px-3 py-2.5 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/50">
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Wind</p>
            <p class="text-base font-medium text-secondary-800 dark:text-white">{{ windSpeed() }}</p>
          </div>

          <div class="px-3 py-2.5 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/50">
            <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Pressure</p>
            <p class="text-base font-medium text-secondary-800 dark:text-white">{{ weather()?.main?.pressure }} hPa</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-4 pt-4 border-t border-secondary-100 dark:border-secondary-700/50 flex items-center justify-between text-xs text-secondary-400 dark:text-secondary-500">
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span>Visibility {{ visibility() }}</span>
        </div>
        <span>Updated {{ lastUpdated() }}</span>
      </div>
    </app-glass-card>
  `,
})
export class CurrentWeatherComponent {
  weather = input<CurrentWeather | null>(null);

  private storageService = inject(StorageService);

  temperature = computed(() => {
    const temp = this.weather()?.main?.temp;
    return temp !== undefined ? Math.round(temp) : '--';
  });

  feelsLike = computed(() => {
    const feels = this.weather()?.main?.feels_like;
    return feels !== undefined ? Math.round(feels) : '--';
  });

  windSpeed = computed(() => {
    const speed = this.weather()?.wind?.speed;
    if (speed === undefined) return '--';
    const kmh = speed * 3.6;
    return `${Math.round(kmh)} km/h`;
  });

  visibility = computed(() => {
    const vis = this.weather()?.visibility;
    if (vis === undefined) return '--';
    return vis >= 1000 ? `${(vis / 1000).toFixed(1)} km` : `${vis} m`;
  });

  lastUpdated = computed(() => {
    const dt = this.weather()?.dt;
    if (!dt) return '--';
    return new Date(dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  isFavorite = computed(() => {
    const w = this.weather();
    if (!w) return false;
    return this.storageService.isFavorite(w.coord.lat, w.coord.lon);
  });

  toggleFavorite(): void {
    const w = this.weather();
    if (!w) return;

    this.storageService.toggleFavorite({
      name: w.name,
      country: w.sys.country,
      lat: w.coord.lat,
      lon: w.coord.lon,
    });
  }
}
