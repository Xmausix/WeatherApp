import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import weatherRoutes from './routes/weather.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: [
            'http://localhost:4200'
        ]
    })
);

app.use(express.json());

app.use('/api/weather', weatherRoutes);

app.listen(process.env['PORT'] || 3000, () => {
    console.log(`Server running on port ${process.env['PORT'] || 3000}`);
});
