const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const app = express();

// Azure SQL Database configuration
const config = {
    user: 'cs330admin',
    password: 'cs330Pass!',
    server: 'cs3303.database.windows.net', 
    database: 'CS_330_3',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

app.use(bodyParser.json());

// Endpoint to insert weather data
app.post('/api/insertWeatherData', async (req, res) => {
    const { location, temperature, weatherDescription, precipitation, humidity, uvIndex, windSpeed, timestamp } = req.body;

    try {
        const pool = await mssql.connect(config);
        await pool.request()
            .input('Location', mssql.VarChar, location)
            .input('Temperature', mssql.Float, temperature)
            .input('WeatherDescription', mssql.VarChar, weatherDescription)
            .input('Precipitation', mssql.Float, precipitation)
            .input('Humidity', mssql.Int, humidity)
            .input('UVIndex', mssql.Int, uvIndex)
            .input('WindSpeed', mssql.Float, windSpeed)
            .input('Timestamp', mssql.DateTime, timestamp)
            .query(`
                INSERT INTO WeatherData (Location, Temperature, WeatherDescription, Precipitation, Humidity, UVIndex, WindSpeed, Timestamp)
                VALUES (@Location, @Temperature, @WeatherDescription, @Precipitation, @Humidity, @UVIndex, @WindSpeed, @Timestamp)
            `);
        res.status(200).send({ message: 'Weather data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send({ message: 'Error inserting weather data' });
    }
});

// Endpoint to get the latest weather data
app.get('/api/currentWeather', async (req, res) => {
    try {
        const pool = await mssql.connect(config);
        const result = await pool.request()
            .query(`SELECT TOP 1 * FROM WeatherData ORDER BY Timestamp DESC`);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send({ message: 'No weather data found' });
        }
    } catch (error) {
        console.error('Error fetching current weather:', error);
        res.status(500).send({ message: 'Error fetching current weather' });
    }
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});