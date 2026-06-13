import { Router, Request, Response } from 'express';

const router = Router();

// ─── Open-Meteo (darmowe, bez klucza API) ─────────────────────────────────
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// ─── Nominatim (OpenStreetMap) do geokodowania / reverse geocoding ─────────
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

// WMO Weather Codes → OpenWeatherMap kompatybilne opisy i ikony
function wmoToOWM(code: number, isDay: number): { main: string; description: string; icon: string } {
    const night = isDay === 0;
    const n = night ? 'n' : 'd';

    if (code === 0) return { main: 'Clear', description: 'clear sky', icon: `01${n}` };
    if (code === 1) return { main: 'Clear', description: 'mainly clear', icon: `01${n}` };
    if (code === 2) return { main: 'Clouds', description: 'partly cloudy', icon: `02${n}` };
    if (code === 3) return { main: 'Clouds', description: 'overcast clouds', icon: `04${n}` };
    if (code === 45 || code === 48) return { main: 'Fog', description: 'fog', icon: `50${n}` };
    if (code === 51) return { main: 'Drizzle', description: 'light drizzle', icon: `09${n}` };
    if (code === 53) return { main: 'Drizzle', description: 'moderate drizzle', icon: `09${n}` };
    if (code === 55) return { main: 'Drizzle', description: 'dense drizzle', icon: `09${n}` };
    if (code === 61) return { main: 'Rain', description: 'slight rain', icon: `10${n}` };
    if (code === 63) return { main: 'Rain', description: 'moderate rain', icon: `10${n}` };
    if (code === 65) return { main: 'Rain', description: 'heavy rain', icon: `10${n}` };
    if (code === 71) return { main: 'Snow', description: 'slight snow fall', icon: `13${n}` };
    if (code === 73) return { main: 'Snow', description: 'moderate snow fall', icon: `13${n}` };
    if (code === 75) return { main: 'Snow', description: 'heavy snow fall', icon: `13${n}` };
    if (code === 77) return { main: 'Snow', description: 'snow grains', icon: `13${n}` };
    if (code === 80) return { main: 'Rain', description: 'slight rain showers', icon: `09${n}` };
    if (code === 81) return { main: 'Rain', description: 'moderate rain showers', icon: `09${n}` };
    if (code === 82) return { main: 'Rain', description: 'violent rain showers', icon: `09${n}` };
    if (code === 85 || code === 86) return { main: 'Snow', description: 'snow showers', icon: `13${n}` };
    if (code === 95) return { main: 'Thunderstorm', description: 'thunderstorm', icon: `11${n}` };
    if (code === 96 || code === 99) return { main: 'Thunderstorm', description: 'thunderstorm with hail', icon: `11${n}` };

    return { main: 'Unknown', description: 'unknown', icon: `01${n}` };
}

// AQI European scale → OWM AQI (1-5)
function euAqiToOwm(aqi: number): number {
    if (aqi <= 20) return 1;   // Good
    if (aqi <= 40) return 2;   // Fair
    if (aqi <= 60) return 3;   // Moderate
    if (aqi <= 80) return 4;   // Poor
    return 5;                   // Very Poor
}

async function fetchJson<T>(url: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'WeatherApp/1.0 (educational project)',
            ...headers,
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`API Error (${response.status}): ${message}`);
    }

    return response.json() as Promise<T>;
}

interface NominatimResult {
    place_id: number;
    display_name: string;
    name: string;
    lat: string;
    lon: string;
    address?: {
        country?: string;
        country_code?: string;
        state?: string;
        city?: string;
        town?: string;
        village?: string;
    };
}

interface OpenMeteoCurrentResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    timezone_abbreviation: string;
    utc_offset_seconds: number;
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        is_day: number;
        precipitation: number;
        weather_code: number;
        surface_pressure: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        wind_gusts_10m: number;
        visibility: number;
        cloud_cover: number;
        uv_index: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        apparent_temperature: number[];
        relative_humidity_2m: number[];
        weather_code: number[];
        precipitation_probability: number[];
        wind_speed_10m: number[];
        is_day: number[];
        visibility: number[];
        precipitation: number[];
    };
    daily: {
        time: string[];
        weather_code: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        sunrise: string[];
        sunset: string[];
        precipitation_probability_max: number[];
        wind_speed_10m_max: number[];
        uv_index_max: number[];
        relative_humidity_2m_max: number[];
    };
}

interface OpenMeteoAirQuality {
    hourly: {
        time: string[];
        european_aqi: number[];
        pm10: number[];
        pm2_5: number[];
        carbon_monoxide: number[];
        nitrogen_dioxide: number[];
        sulphur_dioxide: number[];
        ozone: number[];
    };
}

async function getWeatherData(lat: number, lon: number, cityName: string, country: string) {
    const meteoUrl = `${OPEN_METEO_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,visibility,cloud_cover,uv_index&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,precipitation_probability,wind_speed_10m,is_day,visibility,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max,relative_humidity_2m_max&timezone=auto&forecast_days=5`;

    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto&forecast_days=1`;

    const [meteo, air] = await Promise.all([
        fetchJson<OpenMeteoCurrentResponse>(meteoUrl),
        fetchJson<OpenMeteoAirQuality>(airUrl).catch(() => null),
    ]);

    const c = meteo.current;
    const wmo = wmoToOWM(c.weather_code, c.is_day);

    const timezoneOffset = meteo.utc_offset_seconds;

    // ── Current Weather (format OWM) ────────────────────────────────────────
    const current = {
        id: Math.abs(Math.round(lat * 1000 + lon * 1000)),
        name: cityName,
        coord: { lat, lon },
        weather: [{ id: c.weather_code, main: wmo.main, description: wmo.description, icon: wmo.icon }],
        main: {
            temp: c.temperature_2m,
            feels_like: c.apparent_temperature,
            temp_min: meteo.daily.temperature_2m_min[0] ?? c.temperature_2m,
            temp_max: meteo.daily.temperature_2m_max[0] ?? c.temperature_2m,
            pressure: c.surface_pressure,
            humidity: c.relative_humidity_2m,
        },
        visibility: (c.visibility ?? 10000),
        wind: {
            speed: c.wind_speed_10m / 3.6, // km/h → m/s
            deg: c.wind_direction_10m,
            gust: c.wind_gusts_10m ? c.wind_gusts_10m / 3.6 : undefined,
        },
        clouds: { all: c.cloud_cover },
        dt: Math.floor(new Date(c.time).getTime() / 1000),
        sys: {
            country: country,
            sunrise: Math.floor(new Date(meteo.daily.sunrise[0]).getTime() / 1000),
            sunset: Math.floor(new Date(meteo.daily.sunset[0]).getTime() / 1000),
        },
        timezone: timezoneOffset,
    };

    // ── Hourly (najbliższe 8 wpisów = 8h, format OWM HourlyForecast) ────────
    const now = new Date(c.time);
    const currentHourIdx = meteo.hourly.time.findIndex(t => new Date(t) >= now);
    const startIdx = currentHourIdx >= 0 ? currentHourIdx : 0;

    const hourly = meteo.hourly.time.slice(startIdx, startIdx + 8).map((time, i) => {
        const idx = startIdx + i;
        const hwmo = wmoToOWM(meteo.hourly.weather_code[idx], meteo.hourly.is_day[idx] ?? 1);
        return {
            dt: Math.floor(new Date(time).getTime() / 1000),
            temp: meteo.hourly.temperature_2m[idx],
            feels_like: meteo.hourly.apparent_temperature[idx],
            humidity: meteo.hourly.relative_humidity_2m[idx],
            weather: [{ id: meteo.hourly.weather_code[idx], main: hwmo.main, description: hwmo.description, icon: hwmo.icon }],
            pop: (meteo.hourly.precipitation_probability[idx] ?? 0) / 100,
        };
    });

    // ── Daily (5 dni, format OWM DailyForecast) ──────────────────────────────
    const daily = meteo.daily.time.map((time, i) => {
        const dwmo = wmoToOWM(meteo.daily.weather_code[i], 1);
        return {
            dt: Math.floor(new Date(time).getTime() / 1000),
            temp_min: meteo.daily.temperature_2m_min[i],
            temp_max: meteo.daily.temperature_2m_max[i],
            humidity: meteo.daily.relative_humidity_2m_max[i],
            weather: [{ id: meteo.daily.weather_code[i], main: dwmo.main, description: dwmo.description, icon: dwmo.icon }],
            sunrise: Math.floor(new Date(meteo.daily.sunrise[i]).getTime() / 1000),
            sunset: Math.floor(new Date(meteo.daily.sunset[i]).getTime() / 1000),
            pop: (meteo.daily.precipitation_probability_max[i] ?? 0) / 100,
        };
    });

    // ── Forecast (format OWM ForecastResponse) ───────────────────────────────
    const forecastItems = meteo.hourly.time.map((time, idx) => {
        const fwmo = wmoToOWM(meteo.hourly.weather_code[idx], meteo.hourly.is_day[idx] ?? 1);
        return {
            dt: Math.floor(new Date(time).getTime() / 1000),
            dt_txt: time.replace('T', ' '),
            main: {
                temp: meteo.hourly.temperature_2m[idx],
                feels_like: meteo.hourly.apparent_temperature[idx],
                temp_min: meteo.hourly.temperature_2m[idx],
                temp_max: meteo.hourly.temperature_2m[idx],
                pressure: c.surface_pressure,
                humidity: meteo.hourly.relative_humidity_2m[idx],
            },
            weather: [{ id: meteo.hourly.weather_code[idx], main: fwmo.main, description: fwmo.description, icon: fwmo.icon }],
            clouds: { all: c.cloud_cover },
            wind: { speed: (meteo.hourly.wind_speed_10m[idx] ?? 0) / 3.6, deg: 0 },
            visibility: meteo.hourly.visibility[idx] ?? 10000,
            pop: (meteo.hourly.precipitation_probability[idx] ?? 0) / 100,
            sys: { pod: (meteo.hourly.is_day[idx] ?? 1) === 1 ? 'd' as const : 'n' as const },
        };
    });

    const forecast = {
        cod: '200',
        message: 0,
        cnt: forecastItems.length,
        list: forecastItems,
        city: {
            id: current.id,
            name: cityName,
            coord: { lat, lon },
            country: country,
            population: 0,
            timezone: timezoneOffset,
            sunrise: current.sys.sunrise,
            sunset: current.sys.sunset,
        },
    };

    // ── Air Quality (format OWM) ──────────────────────────────────────────────
    let airQuality = null;
    if (air && air.hourly.european_aqi.length > 0) {
        const aqi = air.hourly.european_aqi[0] ?? 0;
        airQuality = {
            coord: { lon, lat },
            list: [{
                main: { aqi: euAqiToOwm(aqi) },
                components: {
                    co: air.hourly.carbon_monoxide[0] ?? 0,
                    no: 0,
                    no2: air.hourly.nitrogen_dioxide[0] ?? 0,
                    o3: air.hourly.ozone[0] ?? 0,
                    so2: air.hourly.sulphur_dioxide[0] ?? 0,
                    pm2_5: air.hourly.pm2_5[0] ?? 0,
                    pm10: air.hourly.pm10[0] ?? 0,
                    nh3: 0,
                },
                dt: Math.floor(Date.now() / 1000),
            }],
        };
    }

    return { current, forecast, hourly, daily, airQuality };
}

// ─── Geokodowanie przez Open-Meteo Geocoding API ──────────────────────────
async function geocodeCity(query: string): Promise<Array<{ name: string; lat: number; lon: number; country: string; state?: string }>> {
    const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=pl&format=json`;
    const data = await fetchJson<{ results?: Array<{ name: string; latitude: number; longitude: number; country: string; country_code: string; admin1?: string }> }>(url);

    if (!data.results || data.results.length === 0) return [];

    return data.results.map(r => ({
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        country: r.country_code?.toUpperCase() ?? r.country,
        state: r.admin1,
    }));
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// GET /api/weather/search?q=Warszawa
router.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query['q'];
        if (typeof q !== 'string' || !q.trim()) {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }

        const results = await geocodeCity(q);

        // Format zgodny z OWM GeoLocation[]
        res.json(results.map(r => ({
            name: r.name,
            lat: r.lat,
            lon: r.lon,
            country: r.country,
            state: r.state,
        })));
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// GET /api/weather/city?city=Warszawa
router.get('/city', async (req: Request, res: Response): Promise<void> => {
    try {
        const city = req.query['city'];
        if (typeof city !== 'string' || !city.trim()) {
            res.status(400).json({ error: 'Query parameter "city" is required' });
            return;
        }

        const results = await geocodeCity(city);
        if (results.length === 0) {
            res.status(404).json({ error: 'City not found' });
            return;
        }

        const { lat, lon, name, country } = results[0];
        const data = await getWeatherData(lat, lon, name, country);

        res.json(data);
    } catch (error) {
        console.error('City weather error:', error);
        res.status(500).json({ error: 'Weather fetch failed' });
    }
});

// GET /api/weather/coords?lat=52.23&lon=21.01
router.get('/coords', async (req: Request, res: Response): Promise<void> => {
    try {
        const lat = Number(req.query['lat']);
        const lon = Number(req.query['lon']);

        if (Number.isNaN(lat) || Number.isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            res.status(400).json({ error: 'Invalid coordinates' });
            return;
        }

        // Reverse geocoding przez Nominatim żeby dostać nazwę miasta
        let cityName = 'Unknown';
        let country = 'XX';
        try {
            const nominatim = await fetchJson<NominatimResult>(
                `${NOMINATIM_URL}/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            cityName = nominatim.address?.city
                ?? nominatim.address?.town
                ?? nominatim.address?.village
                ?? nominatim.name
                ?? 'Unknown';
            country = (nominatim.address?.country_code ?? 'XX').toUpperCase();
        } catch {
            // Nie krytyczne — kontynuuj bez nazwy
        }

        const data = await getWeatherData(lat, lon, cityName, country);
        res.json(data);
    } catch (error) {
        console.error('Coordinates weather error:', error);
        res.status(500).json({ error: 'Weather fetch failed' });
    }
});

export default router;
