const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const haversine = require('haversine-distance');

const app = express();
const port = 3001; // We'll run this on a different port than React

app.use(cors());
app.use(express.json());

// Airport data for distance calculation (a small sample)
const airportCoordinates = {
  'DEL': { lat: 28.5562, lon: 77.1000 },
  'HKG': { lat: 22.3080, lon: 113.9185 },
  'JFK': { lat: 40.6413, lon: -73.7781 },
  'LHR': { lat: 51.4700, lon: -0.4543 },
  'BOM': { lat: 19.0896, lon: 72.8656 },
  // Add more airports as needed
};

app.post('/api/scrape-flight', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // IMPORTANT: Web scraping is fragile. The selectors below might break if Booking.com changes their website layout.
    // In a real production app, a headless browser like Puppeteer would be more robust.
    
    // For this URL format: https://.../?from=DEL&to=HKG...
    const urlParams = new URL(url).searchParams;
    const fromAirport = urlParams.get('from');
    const toAirport = urlParams.get('to');
    const adults = urlParams.get('adults');
    const flightClass = urlParams.get('cabinClass');
    
    if (!fromAirport || !toAirport) {
        throw new Error('Could not parse airport codes from URL.');
    }

    const originCoords = airportCoordinates[fromAirport];
    const destCoords = airportCoordinates[toAirport];

    if (!originCoords || !destCoords) {
        throw new Error(`Airport coordinates not found for ${fromAirport} or ${toAirport}.`);
    }

    const distanceMeters = haversine(originCoords, destCoords);
    const distanceKm = distanceMeters / 1000;

    // Emission factor: kg CO2e per passenger-km (can be more complex)
    const emissionFactor = 0.18; // Average for medium-haul flight
    const carbonEmissionKg = distanceKm * emissionFactor * parseInt(adults || 1);

    const flightData = {
      origin: fromAirport,
      destination: toAirport,
      distance: Math.round(distanceKm),
      passengers: parseInt(adults || 1),
      flightClass: flightClass || 'ECONOMY',
      carbonEmission: carbonEmissionKg.toFixed(2),
    };

    res.json(flightData);

  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ error: 'Failed to scrape flight data. The URL format may not be supported.' });
  }
});

app.listen(port, () => {
  console.log(`✈️  Flight data server listening on http://localhost:${port}`);
});