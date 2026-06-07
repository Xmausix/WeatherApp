import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { SearchHistoryItem } from '../../core/models/weather.models';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-secondary-600 dark:text-secondary-300">Recent</h3>
        @if (history().length > 0) {
          <button
            (click)="clearHistory()"
            class="text-[10px] text-secondary-400 hover:text-red-500 dark:text-secondary-500 dark:hover:text-red-400 transition-colors"
          >
            Clear
          </button>
        }
      </div>

      @if (history().length === 0) {
        <div class="py-6 text-center">
          <svg class="w-8 h-8 mx-auto mb-2 text-secondary-200 dark:text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-xs text-secondary-400 dark:text-secondary-500">No history</p>
        </div>
      } @else {
        <div class="space-y-1">
          @for (item of history(); track timestamp(item)) {
            <div
              class="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary-50/50 dark:bg-secondary-800/30 hover:bg-secondary-100/50 dark:hover:bg-secondary-700/40 transition-colors cursor-pointer group"
              (click)="onCitySelected.emit(item)"
            >
              <div class="flex items-center gap-2 min-w-0">
                <svg class="w-3.5 h-3.5 text-secondary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-secondary-700 dark:text-secondary-200 truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-secondary-400 dark:text-secondary-500">
                    {{ item.country }} · {{ getTimeAgo(item.timestamp) }}
                  </p>
                </div>
              </div>
              <button
                (click)="removeItem(item.name); $event.stopPropagation()"
                class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-all"
                aria-label="Remove from history"
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
export class HistoryComponent {
  onCitySelected = output<SearchHistoryItem>();

  private storageService = inject(StorageService);

  history = this.storageService.searchHistory;

  removeItem(name: string): void {
    this.storageService.removeFromSearchHistory(name);
  }

  clearHistory(): void {
    this.storageService.clearSearchHistory();
  }

  getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  timestamp(item: SearchHistoryItem): number {
    return item.timestamp;
  }
}
