import { Component, Input, OnInit, signal, effect } from '@angular/core';

@Component({
    selector: 'app-google-ad-banner',
    standalone: true,
    template: `
    @if (showAd()) {
      <div class="my-4 rounded-2xl overflow-hidden border border-secondary-200 dark:border-secondary-700">
        <ins class="adsbygoogle"
             style="display:block; min-height: 90px;"
             [attr.data-ad-client]="adClient"
             [attr.data-ad-slot]="adSlot"
             data-ad-format="auto"
             data-full-width-responsive="true">
        </ins>
      </div>
    }
  `
})
export class GoogleAdBannerComponent implements OnInit {
    @Input() adClient = 'ca-pub-TWOJ_ID';
    @Input() adSlot = '';

    showAd = signal(true);

    ngOnInit() {
        if (typeof window === 'undefined') return;

        const win = window as any;

        // Sprawdź czy AdBlock nie blokuje
        setTimeout(() => {
            const adElement = document.querySelector('.adsbygoogle');
            if (!adElement || adElement.clientHeight < 30) {
                this.showAd.set(false); // Ukryj jeśli reklama nie załadowała się
            }
        }, 1500);

        try {
            (win.adsbygoogle = win.adsbygoogle || []).push({});
        } catch (e) {
            this.showAd.set(false);
        }
    }
}