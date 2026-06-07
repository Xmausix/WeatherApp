import { Injectable, signal, computed } from '@angular/core';
import { SearchHistoryItem, FavoriteCity } from '../models/weather.models';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly SEARCH_HISTORY_KEY = 'weather_search_history';
  private readonly FAVORITES_KEY = 'weather_favorites';
  private readonly THEME_KEY = 'weather_theme';
  private readonly MAX_HISTORY_ITEMS = 10;

  readonly searchHistory = signal<SearchHistoryItem[]>(this.loadSearchHistory());
  readonly favorites = signal<FavoriteCity[]>(this.loadFavorites());
  readonly theme = signal<'light' | 'dark'>(this.loadTheme());

  readonly hasHistory = computed(() => this.searchHistory().length > 0);
  readonly hasFavorites = computed(() => this.favorites().length > 0);

  private loadSearchHistory(): SearchHistoryItem[] {
    try {
      const data = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadFavorites(): FavoriteCity[] {
    try {
      const data = localStorage.getItem(this.FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private loadTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem(this.THEME_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  addToSearchHistory(city: SearchHistoryItem): void {
    const history = this.searchHistory();
    const filtered = history.filter(item => item.name !== city.name);
    const newHistory = [city, ...filtered].slice(0, this.MAX_HISTORY_ITEMS);

    this.searchHistory.set(newHistory);
    localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  }

  removeFromSearchHistory(cityName: string): void {
    const filtered = this.searchHistory().filter(item => item.name !== cityName);
    this.searchHistory.set(filtered);
    localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(filtered));
  }

  clearSearchHistory(): void {
    this.searchHistory.set([]);
    localStorage.removeItem(this.SEARCH_HISTORY_KEY);
  }

  addFavorite(city: Omit<FavoriteCity, 'id' | 'order'>): void {
    const favorites = this.favorites();
    const newFavorite: FavoriteCity = {
      ...city,
      id: `${city.lat}-${city.lon}`,
      order: favorites.length,
    };

    if (!favorites.some(f => f.id === newFavorite.id)) {
      const newFavorites = [...favorites, newFavorite];
      this.favorites.set(newFavorites);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  }

  removeFavorite(id: string): void {
    const filtered = this.favorites().filter(f => f.id !== id);
    this.favorites.set(filtered);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(filtered));
  }

  isFavorite(lat: number, lon: number): boolean {
    const id = `${lat}-${lon}`;
    return this.favorites().some(f => f.id === id);
  }

  toggleFavorite(city: Omit<FavoriteCity, 'id' | 'order'>): void {
    const id = `${city.lat}-${city.lon}`;
    if (this.isFavorite(city.lat, city.lon)) {
      this.removeFavorite(id);
    } else {
      this.addFavorite(city);
    }
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }

  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
}
