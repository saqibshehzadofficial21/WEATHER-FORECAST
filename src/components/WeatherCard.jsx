import React from 'react'
import sunImg from '../assets/sun.svg'
import partlyImg from '../assets/partly.svg'
import cloudImg from '../assets/cloud.svg'
import rainImg from '../assets/rain.svg'
import snowImg from '../assets/snow.svg'
import thunderImg from '../assets/thunder.svg'

function codeToType(code){
  if(code === 0) return 'clear'
  if([1,2,3].includes(code)) return 'partly'
  if([45,48].includes(code)) return 'fog'
  if(code >= 51 && code <= 67) return 'drizzle'
  if(code >= 71 && code <= 77) return 'snow'
  if(code >= 80 && code <= 86) return 'showers'
  if(code >= 95) return 'thunder'
  return 'cloudy'
}

export default function WeatherCard({ data }){
  if(!data) return null

  const type = codeToType(data.code)
  const today = (data.daily && data.daily[0]) || {}
  // determine icon image
  let iconImage = partlyImg
  if(data.code === 0) iconImage = sunImg
  else if(data.code >= 80 && data.code <= 86) iconImage = rainImg
  else if(data.code >= 51 && data.code <= 67) iconImage = rainImg
  else if(data.code >= 71 && data.code <= 77) iconImage = snowImg
  else if(data.code >= 95) iconImage = thunderImg
  else if([1,2,3].includes(data.code)) iconImage = partlyImg
  else iconImage = cloudImg

  return (
    <div className="card hero-card hero--with-visual">
      <div className="hero-grid">
            <div className={`weather-visual visual-3d ${type}`} aria-hidden="true">
              <div className="visual-inner">
                <img src={iconImage} alt="weather" className="weather-img"/>
              </div>
            </div>

        <div className="hero-info">
          <h2 className="city-name">{data.city}</h2>
          <div className="hero-temp"><span className="temp">{data.temp}°{data.unit}</span>
            <div className="desc">{String(data.description)}</div>
          </div>
          <div className="hero-meta">
            <div>Updated: {new Date(data.fetchedAt).toLocaleTimeString()}</div>
            <div className="hl">H {today.max ? Math.round(today.max) : '—'}° &nbsp; L {today.min ? Math.round(today.min) : '—'}°</div>
          </div>
        </div>

        {/* action buttons removed as requested */}
      </div>
    </div>
  )
}
