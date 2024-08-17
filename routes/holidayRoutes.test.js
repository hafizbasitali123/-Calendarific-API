const express = require('express');
const NodeCache = require('node-cache');
const holidayRoutes = require('./holidayRoutes');
const request = require('supertest');

describe('Holiday Routes', () => {
    let app;
    let cache;

    beforeEach(() => {
        app = express();
        cache = new NodeCache({ stdTTL: 10 });

        app.use(express.json());
        app.use((req, res, next) => {
            req.cache = cache;
            next();
        });

        app.use('/api', holidayRoutes);
    });

    test('GET /api/holidays should return holidays and cache the response', async () => {
        const mockHolidays = [{ name: "New Year's Day", date: '2023-01-01' }];
        
        // Mock the route response to prevent real data return
        jest.spyOn(holidayRoutes, 'get').mockImplementation((req, res) => {
            req.cache.set('USA-2023', mockHolidays);
            res.json(mockHolidays);
        });

        const response = await request(app)
            .get('/api/holidays')
            .query({ country: 'USA', year: '2023' });

        expect(response.body).toEqual(mockHolidays);
        expect(cache.get('USA-2023')).toEqual(mockHolidays);
    });

    test('GET /api/holidays should return cached holidays if available', async () => {
        const cachedHolidays = [{ name: "New Year's Day", date: '2023-01-01' }];
        cache.set('USA-2023', cachedHolidays);

        const response = await request(app)
            .get('/api/holidays')
            .query({ country: 'USA', year: '2023' });

        expect(response.body).toEqual(cachedHolidays);
    });

    test('GET /api/holidays should handle errors and return a 500 status', async () => {
        jest.spyOn(holidayRoutes, 'get').mockImplementation((req, res) => {
            res.status(500).json({ error: 'Failed to fetch holidays' });
        });

        const response = await request(app)
            .get('/api/holidays')
            .query({ country: 'USA', year: '2023' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch holidays' });
    });

    test('GET /api/countries should return countries and cache the response', async () => {
        const mockCountries = [
            { country_name: "Yemen", flag_unicode: "🇾🇪", "iso-3166": "YE", supported_languages: 4, total_holidays: 22, uuid: "00c66f1a036bd8f9cb709cb8d925d3d9" }
        ];

        jest.spyOn(holidayRoutes, 'get').mockImplementation((req, res) => {
            req.cache.set('countries', mockCountries);
            res.json(mockCountries);
        });

        const response = await request(app)
            .get('/api/countries');

        expect(response.body).toEqual(mockCountries);
        expect(cache.get('countries')).toEqual(mockCountries);
    });

    test('GET /api/countries should return cached countries if available', async () => {
        const cachedCountries = [
            { country_name: "Yemen", flag_unicode: "🇾🇪", "iso-3166": "YE", supported_languages: 4, total_holidays: 22, uuid: "00c66f1a036bd8f9cb709cb8d925d3d9" }
        ];
        cache.set('countries', cachedCountries);

        const response = await request(app)
            .get('/api/countries');

        expect(response.body).toEqual(cachedCountries);
    });

    test('GET /api/countries should handle errors and return a 500 status', async () => {
        jest.spyOn(holidayRoutes, 'get').mockImplementation((req, res) => {
            res.status(500).json({ error: 'Failed to fetch countries' });
        });

        const response = await request(app)
            .get('/api/countries');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch countries' });
    });
});
