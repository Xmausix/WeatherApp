import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { FavoriteCity } from '../../core/models/weather.models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-secondary-600 dark:text-secondary-300">Favorites</h3>
        @if (favorites().length > 0) {
          <span class="text-xs text-secondary-400 dark:text-secondary-500">{{ favorites().length }}</span>
        }
      </div>

      @if (favorites().length === 0) {
        <div class="py-6 text-center">
          <svg class="w-8 h-8 mx-auto mb-2 text-secondary-200 dark:text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          <p class="text-xs text-secondary-400 dark:text-secondary-500">No favorites yet</p>
        </div>
      } @else {
        <div class="space-y-1">
          @for (favorite of favorites(); track favorite.id) {
            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/30 hover:bg-secondary-100/50 dark:hover:bg-secondary-700/40 transition-colors cursor-pointer group"
              (click)="onCitySelected.emit(favorite)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <svg class="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-secondary-700 dark:text-secondary-200 truncate">{{ favorite.name }}</p>
                  <p class="text-[10px] text-secondary-400 dark:text-secondary-500">{{ favorite.country }}</p>
                </div>
              </div>
              <button
                (click)="removeFavorite(favorite); $event.stopPropagation()"
                class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-all"
                aria-label="Remove from favorites"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class FavoritesComponent {
  onCitySelected = output<FavoriteCity>();

  private storageService = inject(StorageService);

  favorites = this.storageService.favorites;

  removeFavorite(city: FavoriteCity): void {
    this.storageService.removeFavorite(city.id);
  }
}
