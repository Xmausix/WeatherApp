import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentWeather, UVIndex, AirQualityResponse } from '../../../core/models/weather.models';
import { WeatherService } from '../../../core/services/weather.service';

@Component({
  selector: 'app-additional-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- UV Index -->
      <div class="p-4 rounded-xl bg-white/40 dark:bg-secondary-800/40 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-secondary-500 dark:text-secondary-400">UV Index</span>
          <span class="text-xs font-medium" [class]="getUVColorClass()">{{ uvLabel() }}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-semibold text-secondary-800 dark:text-white">{{ uvValue() }}</span>
          <span class="text-xs text-secondary-400">/ 11</span>
        </div>
        <div class="mt-2 h-1 rounded-full bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [class]="getUVBarClass()"
            [style.width.%]="(uvValue() / 11) * 100"
          ></div>
        </div>
      </div>

      <!-- Air Quality -->
      <div class="p-4 rounded-xl bg-white/40 dark:bg-secondary-800/40 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-secondary-500 dark:text-secondary-400">Air Quality</span>
          <span class="text-xs font-medium" [class]="getAQIColorClass()">{{ aqiLabel() }}</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-semibold text-secondary-800 dark:text-white">{{ aqiValue() }}</span>
          <span class="text-xs text-secondary-400">/ 5</span>
        </div>
        <div class="mt-2 h-1 rounded-full bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            [class]="getAQIBarClass()"
            [style.width.%]="(aqiValue() / 5) * 100"
          ></div>
        </div>
      </div>

      <!-- Sunrise -->
      <div class="p-4 rounded-xl bg-white/40 dark:bg-secondary-800/40 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-secondary-500 dark:text-secondary-400">Sunrise</span>
          <svg class="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        </div>
        <span class="text-2xl font-semibold text-secondary-800 dark:text-white">{{ sunrise() }}</span>
      </div>

      <!-- Sunset -->
      <div class="p-4 rounded-xl bg-white/40 dark:bg-secondary-800/40 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-secondary-500 dark:text-secondary-400">Sunset</span>
          <svg class="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
          </svg>
        </div>
        <span class="text-2xl font-semibold text-secondary-800 dark:text-white">{{ sunset() }}</span>
      </div>
    </div>
  `,
})
export class AdditionalInfoComponent {
  weather = input<CurrentWeather | null>(null);
  uv = input<UVIndex | null>(null);
  airQuality = input<AirQualityResponse | null>(null);

  private weatherService = inject(WeatherService);

  uvValue = computed(() => Math.round(this.uv()?.value ?? 0));
  aqiValue = computed(() => this.airQuality()?.list?.[0]?.main?.aqi ?? 0);

  uvLabel = computed(() => {
    const uv = this.uvValue();
    return this.weatherService.getUVDescription(uv).label;
  });

  aqiLabel = computed(() => {
    const aqi = this.aqiValue();
    return this.weatherService.getAQIDescription(aqi).label;
  });

  sunrise = computed(() => {
    const sunrise = this.weather()?.sys?.sunrise;
    if (!sunrise) return '--';
    return new Date(sunrise * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  sunset = computed(() => {
    const sunset = this.weather()?.sys?.sunset;
    if (!sunset) return '--';
    return new Date(sunset * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  });

  getUVColorClass(): string {
    const uv = this.uvValue();
    return this.weatherService.getUVDescription(uv).color;
  }

  getUVBarClass(): string {
    const uv = this.uvValue();
    if (uv <= 2) return 'bg-green-500';
    if (uv <= 5) return 'bg-yellow-500';
    if (uv <= 7) return 'bg-orange-500';
    return 'bg-red-500';
  }

  getAQIColorClass(): string {
    const aqi = this.aqiValue();
    return this.weatherService.getAQIDescription(aqi).color;
  }

  getAQIBarClass(): string {
    const aqi = this.aqiValue();
    if (aqi <= 1) return 'bg-green-500';
    if (aqi === 2) return 'bg-yellow-500';
    if (aqi === 3) return 'bg-orange-500';
    return 'bg-red-500';
  }
}
