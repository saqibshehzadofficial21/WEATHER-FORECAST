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

Notes:
- The app uses the Open-Meteo public API for current weather (no key required).
- Change unit and refresh time in `src/context/AppContext.jsx` or extend the UI to do so.
