import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="classes()" class="skeleton rounded-lg"></div>
  `,
})
export class LoadingSkeletonComponent {
  width = input<string>('w-full');
  height = input<string>('h-4');
  rounded = input<string>('');
  class = input<string>('');

  classes = () => `${this.width()} ${this.height()} ${this.rounded()} ${this.class()}`;
}
