import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

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

import { environment } from '../../../environments/environment.prod';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private http = inject(HttpClient);

    private readonly apiUrl = environment.apiUrl;

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

        return this.http
            .get<GeoLocation[]>(`${this.apiUrl}/weather/search`, {
                params: { q: query },
            })
            .pipe(
                map((results) => {
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

        return this.http
            .get<WeatherData>(`${this.apiUrl}/weather/city`, {
                params: { city: name },
            })
            .pipe(
                map((data) => {
                    this.setWeatherState(data);
                    this.loading.set(false);
                    return data;
                }),
                catchError(() => {
                    this.loading.set(false);
                    this.error.set('City not found. Please try another search.');
                    return of(null);
                })
            );
    }

    getWeatherByCoords(lat: number, lon: number): Observable<WeatherData | null> {
        this.loading.set(true);
        this.error.set(null);

        return this.http
            .get<WeatherData>(`${this.apiUrl}/weather/coords`, {
                params: { lat, lon },
            })
            .pipe(
                map((data) => {
                    this.setWeatherState(data);
                    this.loading.set(false);
                    return data;
                }),
                catchError(() => {
                    this.loading.set(false);
                    this.error.set('Failed to fetch weather data. Please try again.');
                    return of(null);
                })
            );
    }

    private setWeatherState(data: WeatherData) {
        this.currentWeather.set(data.current);
        this.forecast.set(data.forecast);

        this.hourlyForecast.set(data.hourly);
        this.dailyForecast.set(data.daily);

        this.uvIndex.set(data.uv ?? null);
        this.airQuality.set(data.airQuality ?? null);
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
