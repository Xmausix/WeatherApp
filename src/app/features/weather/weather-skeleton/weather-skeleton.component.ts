import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4 animate-pulse">
      <!-- Current Weather Skeleton -->
      <div class="p-5 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div class="flex-1">
            <div class="h-4 w-16 skeleton rounded mb-2"></div>
            <div class="h-3 w-10 skeleton rounded mb-4"></div>
            <div class="flex items-baseline gap-2 mb-3">
              <div class="h-14 w-20 skeleton rounded-lg"></div>
              <div class="h-5 w-4 skeleton rounded"></div>
            </div>
            <div class="h-3 w-24 skeleton rounded"></div>
          </div>
          <div class="grid grid-cols-2 gap-2 md:w-64">
            <div class="p-3 rounded-lg bg-secondary-100/30 dark:bg-secondary-700/20">
              <div class="h-2 w-12 skeleton rounded mb-1"></div>
              <div class="h-4 w-8 skeleton rounded"></div>
            </div>
            <div class="p-3 rounded-lg bg-secondary-100/30 dark:bg-secondary-700/20">
              <div class="h-2 w-12 skeleton rounded mb-1"></div>
              <div class="h-4 w-8 skeleton rounded"></div>
            </div>
            <div class="p-3 rounded-lg bg-secondary-100/30 dark:bg-secondary-700/20">
              <div class="h-2 w-12 skeleton rounded mb-1"></div>
              <div class="h-4 w-10 skeleton rounded"></div>
            </div>
            <div class="p-3 rounded-lg bg-secondary-100/30 dark:bg-secondary-700/20">
              <div class="h-2 w-12 skeleton rounded mb-1"></div>
              <div class="h-4 w-14 skeleton rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hourly Forecast Skeleton -->
      <div class="p-5 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 w-24 skeleton rounded"></div>
          <div class="h-3 w-16 skeleton rounded"></div>
        </div>
        <div class="flex gap-4 overflow-hidden">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="flex-shrink-0 flex flex-col items-center min-w-[48px] py-2">
              <div class="h-3 w-8 skeleton rounded mb-2"></div>
              <div class="w-6 h-6 skeleton rounded mb-2"></div>
              <div class="h-4 w-6 skeleton rounded"></div>
            </div>
          }
        </div>
      </div>

      <!-- Daily Forecast Skeleton -->
      <div class="p-5 rounded-xl bg-white/60 dark:bg-secondary-800/60 border border-secondary-100/50 dark:border-secondary-700/30">
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 w-20 skeleton rounded"></div>
          <div class="h-3 w-16 skeleton rounded"></div>
        </div>
        <div class="space-y-1">
          @for (i of [1,2,3,4,5,6,7]; track i) {
            <div class="flex items-center gap-4 px-3 py-2.5 rounded-lg">
              <div class="h-4 w-12 skeleton rounded"></div>
              <div class="w-6 h-6 skeleton rounded"></div>
              <div class="flex-1 h-3 w-20 skeleton rounded hidden sm:block"></div>
              <div class="flex items-center gap-2">
                <div class="h-4 w-6 skeleton rounded"></div>
                <div class="w-12 h-1 skeleton rounded-full"></div>
                <div class="h-4 w-6 skeleton rounded"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class WeatherSkeletonComponent {}
