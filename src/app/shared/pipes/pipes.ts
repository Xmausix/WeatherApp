import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature',
  standalone: true,
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number | null | undefined, unit: 'C' | 'F' = 'C'): string {
    if (value === null || value === undefined) return '--';

    if (unit === 'F') {
      const fahrenheit = (value * 9 / 5) + 32;
      return `${Math.round(fahrenheit)}°F`;
    }

    return `${Math.round(value)}°C`;
  }
}

@Pipe({
  name: 'windSpeed',
  standalone: true,
})
export class WindSpeedPipe implements PipeTransform {
  transform(value: number | null | undefined, unit: 'kmh' | 'ms' | 'mph' = 'kmh'): string {
    if (value === null || value === undefined) return '--';

    switch (unit) {
      case 'ms':
        return `${value.toFixed(1)} m/s`;
      case 'mph':
        return `${(value * 2.237).toFixed(1)} mph`;
      default:
        return `${(value * 3.6).toFixed(1)} km/h`;
    }
  }
}

@Pipe({
  name: 'pressure',
  standalone: true,
})
export class PressurePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--';
    return `${value} hPa`;
  }
}

@Pipe({
  name: 'percentage',
  standalone: true,
})
export class PercentagePipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--';
    return `${Math.round(value)}%`;
  }
}

@Pipe({
  name: 'visibility',
  standalone: true,
})
export class VisibilityPipe implements PipeTransform {
  transform(value: number | null | undefined, unit: 'km' | 'm' = 'km'): string {
    if (value === null || value === undefined) return '--';

    if (unit === 'm') {
      return `${value} m`;
    }

    return value >= 1000 ? `${(value / 1000).toFixed(1)} km` : `${value} m`;
  }
}

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(timestamp: number | null | undefined, format: 'short' | 'full' = 'short'): string {
    if (!timestamp) return '--';

    const date = new Date(timestamp * 1000);

    if (format === 'full') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

@Pipe({
  name: 'date',
  standalone: true,
})
export class DatePipe implements PipeTransform {
  transform(timestamp: number | null | undefined, format: 'short' | 'day' | 'full' = 'short'): string {
    if (!timestamp) return '--';

    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (format) {
      case 'day':
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
        return date.toLocaleDateString('en-US', { weekday: 'short' });

      case 'full':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

      default:
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }
}

@Pipe({
  name: 'humidity',
  standalone: true,
})
export class HumidityPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '--';
    return `${value}%`;
  }
}
