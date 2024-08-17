const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();
const config = require('../config');

const cache = new NodeCache({ stdTTL: config.cacheTTL });

router.get('/holidays', async (req, res) => {
    const { country, year } = req.query;
    const cacheKey = `${country}-${year}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`${config.apiUrl}/holidays`, {
            params: {
                api_key: config.apiKey,
                country,
                year
            }
        });
        const holidays = response.data.response.holidays;
        cache.set(cacheKey, holidays);
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch holidays' });
    }
});

router.get('/countries', async (req, res) => {
    const cacheKey = 'countries';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`${config.apiUrl}/countries`, {
            params: {
                api_key: config.apiKey
            }
        });
        const countries = response.data.response.countries;
        cache.set(cacheKey, countries);
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch countries' });
    }
});

module.exports = router;
