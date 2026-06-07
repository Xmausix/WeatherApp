import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      (click)="toggleTheme()"
      class="relative w-10 h-10 rounded-xl bg-secondary-100/80 dark:bg-secondary-800/80 border border-secondary-200/50 dark:border-secondary-700/50 hover:bg-secondary-200/80 dark:hover:bg-secondary-700/80 transition-all duration-200 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <svg
        class="w-5 h-5 text-secondary-600 dark:text-secondary-300 transition-all duration-300"
        [class.opacity-0]="isDark()"
        [class.rotate-90]="isDark()"
        [class.scale-0]="isDark()"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
      <svg
        class="absolute w-5 h-5 text-secondary-300 dark:text-secondary-400 transition-all duration-300"
        [class.opacity-0]="!isDark()"
        [class.-rotate-90]="!isDark()"
        [class.scale-0]="!isDark()"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    </button>
  `,
})
export class ThemeToggleComponent {
  private storageService = inject(StorageService);

  isDark(): boolean {
    return this.storageService.theme() === 'dark';
  }

  toggleTheme(): void {
    this.storageService.toggleTheme();
  }
}
