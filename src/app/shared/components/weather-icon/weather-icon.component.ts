import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()" [attr.aria-label]="alt()">
      @switch (weatherType()) {
        @case ('clear') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <circle cx="12" cy="12" r="4" class="text-amber-400" fill="currentColor"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke-linecap="round" class="stroke-amber-500"/>
          </svg>
        }
        @case ('clouds') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <path d="M18.5 10a4.5 4.5 0 00-4.23-4.48A5.002 5.002 0 005 7a4.5 4.5 0 00.5 8.94A4 4 0 0010 17h8.5a3.5 3.5 0 000-7z" fill="currentColor" class="text-secondary-300 dark:text-secondary-600"/>
          </svg>
        }
        @case ('rain') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <path d="M18.5 10a4.5 4.5 0 00-4.23-4.48A5.002 5.002 0 005 7a4.5 4.5 0 00.5 8.94A4 4 0 0010 17h8.5a3.5 3.5 0 000-7z" fill="currentColor" class="text-secondary-300 dark:text-secondary-600"/>
            <path d="M8 20v2M12 20v2M16 20v2M10 22v2M14 22v2" stroke-linecap="round" class="stroke-blue-400"/>
          </svg>
        }
        @case ('thunderstorm') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <path d="M18.5 10a4.5 4.5 0 00-4.23-4.48A5.002 5.002 0 005 7a4.5 4.5 0 00.5 8.94A4 4 0 0010 17h8.5a3.5 3.5 0 000-7z" fill="currentColor" class="text-secondary-400 dark:text-secondary-600"/>
            <path d="M13 12l-2 4h3l-2 4" stroke-linecap="round" stroke-linejoin="round" class="stroke-amber-400" stroke-width="2"/>
          </svg>
        }
        @case ('snow') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <path d="M18.5 10a4.5 4.5 0 00-4.23-4.48A5.002 5.002 0 005 7a4.5 4.5 0 00.5 8.94A4 4 0 0010 17h8.5a3.5 3.5 0 000-7z" fill="currentColor" class="text-secondary-200 dark:text-secondary-600"/>
            <path d="M8 20l1 1M12 19v2M16 20l-1 1" stroke-linecap="round" stroke="currentColor" class="stroke-blue-300"/>
          </svg>
        }
        @case ('mist') {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <path d="M4 8h16M4 12h16M4 16h16" stroke-linecap="round" class="stroke-secondary-400 dark:stroke-secondary-500"/>
          </svg>
        }
        @default {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="w-full h-full">
            <circle cx="12" cy="12" r="4" class="text-amber-400" fill="currentColor"/>
          </svg>
        }
      }
    </div>
  `,
})
export class WeatherIconComponent {
  iconCode = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  alt = input('Weather icon');
  animated = input(false);
  class = input('');

  sizeMap: Record<string, string> = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  weatherType = computed(() => {
    const code = this.iconCode().toLowerCase();
    if (code.includes('01') || code.includes('02')) return 'clear';
    if (code.includes('03') || code.includes('04') || code.includes('50')) return 'clouds';
    if (code.includes('09') || code.includes('10') || code.includes('11')) return 'rain';
    if (code.includes('11')) return 'thunderstorm';
    if (code.includes('13')) return 'snow';
    if (code.includes('50')) return 'mist';
    return 'clear';
  });

  containerClass = computed(() => {
    const sizeClass = this.sizeMap[this.size()] || this.sizeMap['md'];
    return `${sizeClass} ${this.class()}`;
  });
}
