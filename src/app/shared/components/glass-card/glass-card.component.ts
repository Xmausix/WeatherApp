import { Component, input, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glass-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="glass-card p-5 transition-all duration-300"
      [class.glass-card-hover]="hoverable()"
      [class]="class()"
    >
      @if (title() || subtitle()) {
        <div class="mb-4">
          <h3 *ngIf="title()" class="text-lg font-semibold text-secondary-800 dark:text-white">
            {{ title() }}
          </h3>
          <p *ngIf="subtitle()" class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ subtitle() }}
          </p>
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class GlassCardComponent {
  title = input<string>('');
  subtitle = input<string>('');
  hoverable = input(false);
  class = input<string>('');
}
