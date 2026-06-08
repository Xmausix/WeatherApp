import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-google-ad',
    standalone: true,
    template: `
    <div class="google-ad-wrapper my-4" [ngClass]="size">
      <ins class="adsbygoogle"
           style="display:block"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="adSlot"
           [attr.data-ad-format]="format"
           data-full-width-responsive="true">
      </ins>
    </div>
  `
})
export class GoogleAdComponent {
    @Input() adClient = 'ca-pub-XXXXXXXXXXXXXXXX';
    @Input() adSlot!: string;
    @Input() format: 'auto' | 'rectangle' | 'fluid' = 'auto';
    @Input() size: 'banner' | 'sidebar' | 'inline' = 'banner';
}