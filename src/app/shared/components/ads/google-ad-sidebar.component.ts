import { Component, Input, signal } from '@angular/core';

@Component({
    selector: 'app-google-ad-sidebar',
    standalone: true,
    template: `
    @if (showAd()) {
      <div class="my-4 p-1 bg-white dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700">
        <ins class="adsbygoogle"
             style="display:block; min-height: 250px;"
             [attr.data-ad-client]="adClient"
             [attr.data-ad-slot]="adSlot"
             data-ad-format="rectangle">
        </ins>
      </div>
    }
  `
})
export class GoogleAdSidebarComponent {
    @Input() adClient = 'ca-pub-TWOJ_ID';
    @Input() adSlot = '';

    showAd = signal(true);

    ngOnInit() {
        if (typeof window === 'undefined') return;

        setTimeout(() => {
            const ad = document.querySelector('.adsbygoogle');
            if (!ad || ad.clientHeight < 50) {
                this.showAd.set(false);
            }
        }, 1800);

        try {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch {
            this.showAd.set(false);
        }
    }
}