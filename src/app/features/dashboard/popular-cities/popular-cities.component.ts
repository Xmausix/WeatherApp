import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PopularCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-popular-cities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-8">
      <h2 class="text-lg font-medium text-secondary-600 dark:text-secondary-300 mb-4">
        Popular Destinations
      </h2>
      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        @for (city of popularCities; track city.name) {
          <button
            (click)="onCitySelected.emit(city)"
            class="flex-shrink-0 px-4 py-2.5 rounded-full bg-secondary-100/80 dark:bg-secondary-800/80 hover:bg-secondary-200 dark:hover:bg-secondary-700 border border-secondary-200/50 dark:border-secondary-700/50 transition-all duration-200 group"
          >
            <span class="text-sm font-medium text-secondary-700 dark:text-secondary-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ city.name }}
            </span>
          </button>
        }
      </div>
    </div>
  `,
})
export class PopularCitiesComponent {
  onCitySelected = output<PopularCity>();

  popularCities: PopularCity[] = [
    { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006 },
    { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
    { name: 'Singapore', country: 'SG', lat: 1.3521, lon: 103.8198 },
    { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
    { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
  ];
}
