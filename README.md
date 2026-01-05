# Weather Forecast App

Minimal React + Vite app demonstrating:

- `useState` for `weatherData`, city input, and loading state
- `useEffect` to fetch on mount, city change, and auto-refresh
- `useContext` for `unit` and `refreshTime`
- Passing `weatherData` to `WeatherCard` via props

Run locally:

```bash
npm install
npm run dev
```

## APIs Used

The app utilizes the following APIs from Open-Meteo (website: https://open-meteo.com/):

- **Weather Forecast API**:

  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Purpose: Fetches current weather, hourly temperature, and daily forecasts.
  - No API key required (public API).

- **Geocoding API**:
  - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
  - Purpose: Converts city names to latitude and longitude coordinates.
  - No API key required (public API).

Notes:

- The app uses the Open-Meteo public API for current weather (no key required).
- Change unit and refresh time in `src/context/AppContext.jsx` or extend the UI to do so.
