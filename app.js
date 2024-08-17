const express = require('express');
const holidayRoutes = require('./routes/holidayRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api', holidayRoutes);

// To start the server, use the command: node app.js
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
