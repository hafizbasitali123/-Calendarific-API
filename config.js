require('dotenv').config();

const config = {
    apiKey: process.env.CALENDARIFIC_API_KEY,
    apiUrl: 'https://calendarific.com/api/v2',
    cacheTTL: 86400, // 1 day in seconds
};

module.exports = config;
