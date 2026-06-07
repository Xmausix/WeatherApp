import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherIconComponent } from '../../../shared/components/weather-icon/weather-icon.component';
import { HourlyForecast } from '../../../core/models/weather.models';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule, WeatherIconComponent],
  template: `
    <div class="p-5 glass-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-secondary-600 dark:text-secondary-300">Hourly Forecast</h3>
        <span class="text-xs text-secondary-400 dark:text-secondary-500">Next 24 hours</span>
      </div>
      <div class="overflow-x-auto scrollbar-none -mx-2 px-2">
        <div class="flex gap-4 pb-2">
          @for (hour of hourly(); track hour.dt) {
            <div
              class="flex flex-col items-center flex-shrink-0 min-w-[48px] py-2 px-1 rounded-lg transition-colors"
              [class.bg-primary-50/50]="isNow(hour.dt)"
              [class.dark:bg-primary-900/10]="isNow(hour.dt)"
            >
              <span class="text-[10px] font-medium mb-1.5"
                [class.text-primary-600]="isNow(hour.dt)"
                [class.text-secondary-400]="!isNow(hour.dt)"
              >
                {{ getHour(hour.dt) }}
              </span>
              <app-weather-icon
                [iconCode]="hour.weather[0]?.icon ?? ''"
                size="sm"
                class="mb-1.5"
              />
              <span class="text-sm font-medium text-secondary-800 dark:text-white">
                {{ getTemp(hour.temp) }}°
              </span>
              @if (hour.pop > 0) {
                <span class="text-[10px] text-blue-500 mt-0.5">
                  {{ getPop(hour.pop) }}
                </span>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class HourlyForecastComponent {
  hourly = input<HourlyForecast[]>([]);

  getHour(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();

    if (date.getHours() === now.getHours() && date.getDate() === now.getDate()) {
      return 'Now';
    }

    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }

  getTemp(temp: number): string {
    return Math.round(temp).toString();
  }

  getPop(pop: number): string {
    if (pop === 0) return '';
    return `${Math.round(pop * 100)}%`;
  }

  isNow(timestamp: number): boolean {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    return date.getHours() === now.getHours() && date.getDate() === now.getDate();
  }
}
