import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, forkJoin, switchMap } from 'rxjs';
import {
  CurrentWeather,
  ForecastResponse,
  GeoLocation,
  HourlyForecast,
  DailyForecast,
  UVIndex,
  AirQualityResponse,
  WeatherData,
} from '../models/weather.models';
import {environment} from "../../../environments/environment.prod";
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private http = inject(HttpClient);

  private readonly apiKey = environment.openWeatherApiKey;
  private readonly baseUrl = environment.openWeatherBaseUrl;
  private readonly geoUrl = environment.openWeatherGeoUrl

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentWeather = signal<CurrentWeather | null>(null);
  readonly forecast = signal<ForecastResponse | null>(null);
  readonly hourlyForecast = signal<HourlyForecast[]>([]);
  readonly dailyForecast = signal<DailyForecast[]>([]);
  readonly uvIndex = signal<UVIndex | null>(null);
  readonly airQuality = signal<AirQualityResponse | null>(null);
  readonly searchResults = signal<GeoLocation[]>([]);

  readonly hasWeatherData = computed(() => this.currentWeather() !== null);

  searchCities(query: string): Observable<GeoLocation[]> {
    if (!query || query.length < 2) {
      this.searchResults.set([]);
      return of([]);
    }

    const params = new HttpParams()
      .set('q', query)
      .set('limit', '5')
      .set('appid', this.apiKey);

    return this.http.get<GeoLocation[]>(`${this.geoUrl}/direct`, { params }).pipe(
      map(results => {
        this.searchResults.set(results);
        return results;
      }),
      catchError(() => {
        this.searchResults.set([]);
        return of([]);
      })
    );
  }

  getWeatherByCity(name: string): Observable<WeatherData | null> {
    this.loading.set(true);
    this.error.set(null);

    const params = new HttpParams()
      .set('q', name)
      .set('appid', this.apiKey)
      .set('units', 'metric');

    return this.http.get<CurrentWeather>(`${this.baseUrl}/weather`, { params }).pipe(
      switchMap(current => this.getFullWeatherData(current.coord.lat, current.coord.lon, current)),
      catchError(err => {
        this.loading.set(false);
        this.error.set('City not found. Please try another search.');
        return of(null);
      })
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData | null> {
    this.loading.set(true);
    this.error.set(null);

    return forkJoin({
      current: this.getCurrentWeather(lat, lon),
      forecast: this.getForecast(lat, lon),
      uv: this.getUVIndex(lat, lon),
      air: this.getAirQuality(lat, lon),
    }).pipe(
      map(({ current, forecast, uv, air }) => {
        const hourly = this.processHourlyForecast(forecast.list.slice(0, 24));
        const daily = this.processDailyForecast(forecast.list);

        this.currentWeather.set(current);
        this.forecast.set(forecast);
        this.hourlyForecast.set(hourly);
        this.dailyForecast.set(daily);
        this.uvIndex.set(uv);
        this.airQuality.set(air);
        this.loading.set(false);

        return {
          current,
          forecast,
          hourly,
          daily,
          uv: uv ?? undefined,
          airQuality: air ?? undefined,
        };
      }),
      catchError(err => {
        this.loading.set(false);
        this.error.set('Failed to fetch weather data. Please try again.');
        return of(null);
      })
    );
  }

  private getFullWeatherData(lat: number, lon: number, current?: CurrentWeather): Observable<WeatherData | null> {
    return forkJoin({
      current: current ? of(current) : this.getCurrentWeather(lat, lon),
      forecast: this.getForecast(lat, lon),
      uv: this.getUVIndex(lat, lon),
      air: this.getAirQuality(lat, lon),
    }).pipe(
      map(({ current, forecast, uv, air }) => {
        const hourly = this.processHourlyForecast(forecast.list.slice(0, 24));
        const daily = this.processDailyForecast(forecast.list);

        this.currentWeather.set(current);
        this.forecast.set(forecast);
        this.hourlyForecast.set(hourly);
        this.dailyForecast.set(daily);
        this.uvIndex.set(uv);
        this.airQuality.set(air);
        this.loading.set(false);

        return {
          current,
          forecast,
          hourly,
          daily,
          uv: uv ?? undefined,
          airQuality: air ?? undefined,
        };
      })
    );
  }

  private getCurrentWeather(lat: number, lon: number): Observable<CurrentWeather> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey)
      .set('units', 'metric');

    return this.http.get<CurrentWeather>(`${this.baseUrl}/weather`, { params });
  }

  private getForecast(lat: number, lon: number): Observable<ForecastResponse> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('cnt', '40');

    return this.http.get<ForecastResponse>(`${this.baseUrl}/forecast`, { params });
  }

  private getUVIndex(lat: number, lon: number): Observable<UVIndex | null> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey);

    return this.http.get<UVIndex>(`${this.baseUrl}/uvi`, { params }).pipe(
      catchError(() => of(null))
    );
  }

  private getAirQuality(lat: number, lon: number): Observable<AirQualityResponse | null> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey);

    return this.http.get<AirQualityResponse>(`${this.baseUrl}/air_pollution`, { params }).pipe(
      catchError(() => of(null))
    );
  }

  private processHourlyForecast(items: ForecastResponse['list']): HourlyForecast[] {
    return items.map(item => ({
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      weather: item.weather,
      pop: item.pop || 0,
    }));
  }

  private processDailyForecast(items: ForecastResponse['list']): DailyForecast[] {
    const dailyMap = new Map<string, typeof items>();

    items.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      const existing = dailyMap.get(date);
      if (existing) {
        existing.push(item);
      } else {
        dailyMap.set(date, [item]);
      }
    });

    return Array.from(dailyMap.entries()).slice(0, 7).map(([_, dayItems]) => {
      const temps = dayItems.map(i => i.main.temp);
      const tempMin = Math.min(...temps);
      const tempMax = Math.max(...temps);
      const midDayItem = dayItems[Math.floor(dayItems.length / 2)];

      return {
        dt: midDayItem.dt,
        temp_min: tempMin,
        temp_max: tempMax,
        humidity: midDayItem.main.humidity,
        weather: midDayItem.weather,
        sunrise: midDayItem.sys.pod === 'd' ? midDayItem.dt : Date.now() / 1000,
        sunset: midDayItem.sys.pod === 'n' ? midDayItem.dt : Date.now() / 1000 + 43200,
      };
    });
  }

  getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }

  getAQIDescription(aqi: number): { label: string; color: string } {
    switch (aqi) {
      case 1:
        return { label: 'Good', color: 'text-green-500' };
      case 2:
        return { label: 'Fair', color: 'text-yellow-500' };
      case 3:
        return { label: 'Moderate', color: 'text-orange-500' };
      case 4:
        return { label: 'Poor', color: 'text-red-500' };
      case 5:
        return { label: 'Very Poor', color: 'text-purple-500' };
      default:
        return { label: 'Unknown', color: 'text-gray-500' };
    }
  }

  getUVDescription(uv: number): { label: string; color: string } {
    if (uv <= 2) return { label: 'Low', color: 'text-green-500' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-500' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-500' };
    if (uv <= 10) return { label: 'Very High', color: 'text-red-500' };
    return { label: 'Extreme', color: 'text-purple-500' };
  }

  clearError(): void {
    this.error.set(null);
  }
}
