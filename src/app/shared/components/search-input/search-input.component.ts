import { Component, output, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, catchError, of } from 'rxjs';
import { WeatherService } from '../../../core/services/weather.service';
import { GeoLocation } from '../../../core/models/weather.models';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full max-w-md">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          type="text"
          [placeholder]="placeholder()"
          [value]="searchQuery()"
          (input)="onInput($event)"
          (keydown.enter)="onEnter()"
          (keydown.escape)="closeDropdown()"
          (blur)="onBlur()"
          class="w-full pl-10 pr-10 py-2.5 text-sm bg-white/80 dark:bg-secondary-800/80 border border-secondary-200/50 dark:border-secondary-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 placeholder:text-secondary-400 dark:placeholder:text-secondary-500 text-secondary-800 dark:text-white"
          aria-label="Search for a city"
          autocomplete="off"
        />
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
          <button
            *ngIf="searchQuery().length > 0"
            (click)="clearSearch(); $event.stopPropagation()"
            class="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors p-0.5"
            aria-label="Clear search"
            (mousedown)="$event.preventDefault()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div *ngIf="isLoading()" class="w-4 h-4">
            <svg class="w-4 h-4 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        </div>
      </div>

      @if (showDropdown() && searchResults().length > 0) {
        <div class="absolute z-50 w-full mt-1 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg overflow-hidden">
          <ul class="py-1 max-h-52 overflow-y-auto scrollbar-thin">
            @for (result of searchResults(); track uniqueId($index, result)) {
              <li>
                <button
                  (mousedown)="selectCity(result); $event.preventDefault()"
                  class="w-full px-3 py-2.5 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors flex items-center gap-2.5"
                >
                  <svg class="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-secondary-800 dark:text-white truncate">{{ result.name }}</p>
                    <p class="text-xs text-secondary-500 dark:text-secondary-400 truncate">
                      {{ result.state ? result.state + ', ' : '' }}{{ result.country }}
                    </p>
                  </div>
                </button>
              </li>
            }
          </ul>
        </div>
      }

      @if (showDropdown() && searchQuery().length >= 2 && searchResults().length === 0 && !isLoading()) {
        <div class="absolute z-50 w-full mt-1 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200/50 dark:border-secondary-700/50 shadow-lg p-4 text-center">
          <p class="text-sm text-secondary-500 dark:text-secondary-400">No cities found</p>
        </div>
      }
    </div>
  `,
})
export class SearchInputComponent {
  placeholder = input('Search city...');
  citySelected = output<GeoLocation>();
  searchCleared = output<void>();

  searchQuery = signal('');
  searchResults = signal<GeoLocation[]>([]);
  showDropdown = signal(false);
  isLoading = signal(false);

  private searchSubject = new Subject<string>();
  private weatherService = inject(WeatherService);

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.isLoading.set(true)),
        switchMap(query => {
          if (query.length < 2) {
            return of([]);
          }
          return this.weatherService.searchCities(query);
        }),
        tap(() => this.isLoading.set(false)),
        catchError(() => of([]))
      )
      .subscribe(results => {
        this.searchResults.set(results);
      });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);

    if (value.length >= 2) {
      this.showDropdown.set(true);
      this.searchSubject.next(value);
    } else {
      this.showDropdown.set(false);
      this.searchResults.set([]);
    }
  }

  onEnter(): void {
    const results = this.searchResults();
    if (results.length > 0) {
      this.selectCity(results[0]);
    }
  }

  onBlur(): void {
    setTimeout(() => this.closeDropdown(), 150);
  }

  selectCity(city: GeoLocation): void {
    this.citySelected.emit(city);
    this.searchQuery.set(city.name);
    this.closeDropdown();
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.showDropdown.set(false);
    this.searchCleared.emit();
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  uniqueId(index: number, item: GeoLocation): string {
    return `${item.lat}-${item.lon}`;
  }
}
