import { Router, Request, Response } from 'express';

const router = Router();

const API_KEY = process.env['OPENWEATHER_API_KEY']!;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

router.get('/search', async (req: Request, res: Response): Promise<void> => {
    try {
        const q = req.query['q'] as string;

        const response = await fetch(
            `${GEO_URL}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
        );

        const data = await response.json();
        res.json(data);
        return;
    } catch {
        res.status(500).json({ error: 'Search failed' });
        return;
    }
});

router.get('/city', async (req: Request, res: Response): Promise<void> => {
    try {
        const city = req.query['city'] as string;

        const currentResponse = await fetch(
            `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
        );

        if (!currentResponse.ok) {
            res.status(404).json({ error: 'City not found' });
            return;
        }

        const current = await currentResponse.json();
        const { lat, lon } = current.coord;

        const [forecast, air] = await Promise.all([
            fetch(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}`
            ).then(r => r.json()),
            fetch(
                `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            ).then(r => r.json())
        ]);

        res.json({
            current,
            forecast,
            hourly: forecast.list.slice(0, 24),
            daily: forecast.list,
            airQuality: air
        });
        return;
    } catch {
        res.status(500).json({ error: 'Weather fetch failed' });
        return;
    }
});

router.get('/coords', async (req: Request, res: Response): Promise<void> => {
    try {
        const lat = req.query['lat'];
        const lon = req.query['lon'];

        const [current, forecast, air] = await Promise.all([
            fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            ).then(r => r.json()),
            fetch(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}`
            ).then(r => r.json()),
            fetch(
                `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
            ).then(r => r.json())
        ]);

        res.json({
            current,
            forecast,
            hourly: forecast.list.slice(0, 24),
            daily: forecast.list,
            airQuality: air
        });
        return;
    } catch {
        res.status(500).json({ error: 'Weather fetch failed' });
        return;
    }
});

export default router;
