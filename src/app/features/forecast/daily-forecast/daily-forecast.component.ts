import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '../../../shared/components';
import { DailyForecast } from '../../../core/models/weather.models';

@Component({
  selector: 'app-daily-forecast',
  standalone: true,
  imports: [CommonModule, WeatherIconComponent],
  template: `
    <div class="p-5 glass-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-secondary-600 dark:text-secondary-300">7-Day Forecast</h3>
        <span class="text-xs text-secondary-400 dark:text-secondary-500">Weekly outlook</span>
      </div>
      <div class="space-y-1">
        @for (day of daily(); track day.dt; let i = $index) {
          <div
            class="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-secondary-50/50 dark:hover:bg-secondary-800/30 transition-colors"
          >
            <!-- Day Name -->
            <span class="w-16 text-sm font-medium text-secondary-700 dark:text-secondary-200">
              {{ getDayName(day.dt, i) }}
            </span>

            <!-- Weather Icon -->
            <app-weather-icon
              [iconCode]="day.weather[0]?.icon ?? ''"
              size="sm"
            />

            <!-- Condition -->
            <span class="flex-1 text-xs text-secondary-500 dark:text-secondary-400 capitalize hidden sm:block">
              {{ day.weather[0]?.description }}
            </span>

            <!-- Temperature Range -->
            <div class="flex items-center gap-2 w-28 justify-end">
              <span class="text-sm text-secondary-400 dark:text-secondary-500">
                {{ getTemp(day.temp_min) }}°
              </span>
              <div class="w-12 h-1 rounded-full bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
                  [style.width.%]="getBarWidth(day.temp_min, day.temp_max)"
                ></div>
              </div>
              <span class="text-sm font-medium text-secondary-700 dark:text-secondary-200">
                {{ getTemp(day.temp_max) }}°
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class DailyForecastComponent {
  daily = input<DailyForecast[]>([]);

  private minTemp = 0;
  private maxTemp = 40;

  getDayName(timestamp: number, index: number): string {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  getTemp(temp: number): string {
    return Math.round(temp).toString();
  }

  getBarWidth(min: number, max: number): number {
    const range = this.maxTemp - this.minTemp;
    const normalizedMin = Math.max(0, (min - this.minTemp) / range);
    const normalizedMax = Math.min(1, (max - this.minTemp) / range);
    return ((normalizedMax - normalizedMin) / (1 - normalizedMin)) * 100;
  }
}
