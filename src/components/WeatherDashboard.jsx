import React, { useContext, useEffect, useState, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import WeatherCard from './WeatherCard'
import ForecastStrip from './ForecastStrip'
import HourlyChart from './HourlyChart'
import ContinentView from './ContinentView'

// Pakistan city coordinates
const CITY_COORDS = {
  Islamabad: { latitude: 33.6844, longitude: 73.0479 },
  Lahore: { latitude: 31.5204, longitude: 74.3587 },
  Karachi: { latitude: 24.8607, longitude: 67.0011 },
  Peshawar: { latitude: 34.0151, longitude: 71.5249 },
  Quetta: { latitude: 30.1798, longitude: 66.9750 }
}

function cToF(c){
  return (c * 9) / 5 + 32
}

function cToK(c){
  return c + 273.15
}

function inPakistan(lat, lon){
  // rough bounding box for Pakistan
  return lat >= 23 && lat <= 37 && lon >= 60 && lon <= 78
}

export default function WeatherDashboard(){
  const { unit, refreshTime, setUnit } = useContext(AppContext)
  const { theme, setTheme } = useContext(AppContext)

  const [weatherData, setWeatherData] = useState(null)
  const [cityInput, setCityInput] = useState('Islamabad')
  const [city, setCity] = useState('Islamabad')
  const [loading, setLoading] = useState(false)
  

  const intervalRef = useRef(null)

  async function fetchWeatherForCoords(lat, lon, cityName='Location'){
    setLoading(true)
    try{
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      const res = await fetch(url)
      const json = await res.json()

      const tempC = json.current_weather?.temperature ?? null
      const code = json.current_weather?.weathercode ?? null
      const description = json.current_weather ? `Code ${code}` : 'Clear'

      // build hourly and daily arrays
      const hourlyTemps = (json.hourly?.temperature_2m || []).slice(0,24).map((t,i)=>({ temp:t, time: i }))
      const daily = (json.daily?.temperature_2m_max || []).map((t,i)=>({ day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][(new Date().getDay()+i)%7], max: t, min: json.daily.temperature_2m_min[i] }))

      const data = { city: cityName, tempC, code, description, fetchedAt: new Date().toISOString(), hourly: hourlyTemps, daily }

      // compute conversions
      if(unit === 'F'){
        data.temp = Math.round(cToF(data.tempC) * 10) / 10
        data.unit = 'F'
        data.hourly = data.hourly.map(h=>({ ...h, temp: Math.round(cToF(h.temp)*10)/10 }))
        data.daily = data.daily.map(d=>({ ...d, max: Math.round(cToF(d.max)*10)/10, min: Math.round(cToF(d.min)*10)/10 }))
      } else if(unit === 'K'){
        data.temp = Math.round(cToK(data.tempC) * 10) / 10
        data.unit = 'K'
        data.hourly = data.hourly.map(h=>({ ...h, temp: Math.round(cToK(h.temp)*10)/10 }))
        data.daily = data.daily.map(d=>({ ...d, max: Math.round(cToK(d.max)*10)/10, min: Math.round(cToK(d.min)*10)/10 }))
      } else {
        data.temp = Math.round(data.tempC * 10) / 10
        data.unit = 'C'
        data.hourly = data.hourly.map(h=>({ ...h, temp: Math.round(h.temp*10)/10 }))
        data.daily = data.daily.map(d=>({ ...d, max: Math.round(d.max*10)/10, min: Math.round(d.min*10)/10 }))
      }

      setWeatherData(data)
      
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  async function fetchWeather(forCity){
    // if we have static coords for the city
    const coords = CITY_COORDS[forCity]
    if(coords){
      await fetchWeatherForCoords(coords.latitude, coords.longitude, forCity)
      return
    }

    // if 'Current location' requested, try geolocation
    if(forCity === 'Current location' && navigator?.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        fetchWeatherForCoords(latitude, longitude, 'Current location')
      }, async () => {
        // fallback to Islamabad
        const d = CITY_COORDS['Islamabad']
        await fetchWeatherForCoords(d.latitude, d.longitude, 'Islamabad')
      })
      return
    }

    // geocode the city (limit to Pakistan if possible)
    try{
      const name = encodeURIComponent(forCity)
      const geourl = `https://geocoding-api.open-meteo.com/v1/search?name=${name}&country=PK&count=1`
      const gres = await fetch(geourl)
      const gj = await gres.json()
      if(gj && gj.results && gj.results.length>0){
        const r = gj.results[0]
        await fetchWeatherForCoords(r.latitude, r.longitude, r.name)
        return
      }
    }catch(e){
      console.warn('Geocoding failed', e)
    }

    // final fallback to Islamabad
    const d = CITY_COORDS['Islamabad']
    await fetchWeatherForCoords(d.latitude, d.longitude, 'Islamabad')
  }

  // on mount: try geolocation -> otherwise load default
  useEffect(() => {
    if(navigator && navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords
        if(inPakistan(latitude, longitude)){
          setCity('Current location')
          fetchWeather('Current location')
        } else {
          setCity('Islamabad')
          fetchWeather('Islamabad')
        }
      }, () => {
        setCity('Islamabad')
        fetchWeather('Islamabad')
      })
    } else {
      setCity('Islamabad')
      fetchWeather('Islamabad')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // fetch when city or unit changes
  useEffect(() => {
    if(!city) return
    fetchWeather(city)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, unit])

  // Auto-refresh that respects current city selection
  useEffect(() => {
    if(intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      fetchWeather(city)
    }, refreshTime)

    return () => { if(intervalRef.current) clearInterval(intervalRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTime, city, unit])

  function handleSubmit(e){
    e.preventDefault()
    if(cityInput.trim()) setCity(cityInput.trim())
  }

  function handleRefresh(){
    fetchWeather(city)
  }

  function toggleTheme(){
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  

  return (
    <div className="dashboard">
      <form onSubmit={handleSubmit} className="city-form">
        <input value={cityInput} onChange={e => setCityInput(e.target.value)} placeholder="Enter city (e.g. Islamabad)" />
        <button type="submit">Load</button>
        <div className="city-buttons">
          {Object.keys(CITY_COORDS).map(k => (
            <button key={k} type="button" onClick={() => { setCity(k); setCityInput(k) }}>{k}</button>
          ))}
          <button type="button" onClick={() => { setCity('Current location'); setCityInput('Current location') }}>Use my location</button>
        </div>
      </form>

      <div className="controls">
        <div className="unit-select">
          <label className={unit==='C' ? 'active':''} onClick={() => setUnit('C')}>°C</label>
          <label className={unit==='F' ? 'active':''} onClick={() => setUnit('F')}>°F</label>
          <label className={unit==='K' ? 'active':''} onClick={() => setUnit('K')}>K</label>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div className="status"><strong>Auto-refresh:</strong> {refreshTime / 1000}s</div>
          <button type="button" onClick={handleRefresh} className="refresh-btn">Refresh</button>
          <button type="button" onClick={toggleTheme} className="refresh-btn" aria-pressed={theme==='light'} style={{marginLeft:8}}>{theme==='light' ? 'Light' : 'Dark'}</button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {weatherData ? (
        <>
          <WeatherCard data={weatherData} />
          <ForecastStrip daily={weatherData.daily || []} />
          <div style={{height:12}} />
          <HourlyChart hourly={weatherData.hourly || []} />
              <ContinentView />
            </>
      ) : (
        <div>No data yet</div>
      )}
      
    </div>
  )
}
