import { Component, input, AfterViewInit, ViewChild, ElementRef, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HourlyForecast } from '../../../core/models/weather.models';

Chart.register(...registerables);

@Component({
  selector: 'app-weather-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-5 glass-card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-secondary-600 dark:text-secondary-300">Temperature Trend</h3>
        <span class="text-xs text-secondary-400 dark:text-secondary-500">Hourly</span>
      </div>
      <div class="h-48">
        <canvas #chart></canvas>
      </div>
    </div>
  `,
})
export class WeatherStatsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chart') canvas!: ElementRef<HTMLCanvasElement>;

  hourly = input<HourlyForecast[]>([]);
  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      if (this.chart && this.hourly()) {
        this.updateChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private initChart(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(148, 163, 184, 0.15)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const gradient = ctx.createLinearGradient(0, 0, 0, 192);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

    const data = this.hourly();
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(h => this.getLabel(h.dt)),
        datasets: [{
          label: 'Temperature',
          data: data.map(h => Math.round(h.temp)),
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          borderColor: '#3b82f6',
          backgroundColor: gradient,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#fff',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#e2e8f0' : '#334155',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (context) => `${Math.round(context.parsed.y ?? 0)}°C`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            border: {
              display: false,
            },
            ticks: {
              color: textColor,
              maxTicksLimit: 8,
              font: {
                size: 10,
              },
            },
          },
          y: {
            grid: {
              color: gridColor,
            },
            border: {
              display: false,
            },
            ticks: {
              color: textColor,
              callback: (value) => `${value}°`,
              font: {
                size: 10,
              },
            },
          },
        },
      },
    });

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.chart) return;

    const data = this.hourly();
    this.chart.data.labels = data.map(h => this.getLabel(h.dt));
    this.chart.data.datasets[0].data = data.map(h => Math.round(h.temp));
    this.chart.update('none');
  }

  private getLabel(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }
}
