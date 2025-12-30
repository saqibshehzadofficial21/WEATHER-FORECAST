import React from 'react'
import sunImg from '../assets/sun.svg'
import partlyImg from '../assets/partly.svg'
import cloudImg from '../assets/cloud.svg'
import rainImg from '../assets/rain.svg'
import snowImg from '../assets/snow.svg'

function DayTile({ day, index }){
  const isToday = index === 0
  // pick icon type naive: if max>20 -> clear, else partly/cloudy; if min below 0 -> snow
  let img = partlyImg
  if(day.max >= 30) img = sunImg
  else if(day.max <= 5) img = snowImg
  else if(day.max <= 12) img = cloudImg

  return (
    <div className={`day-tile card ${isToday? 'today':''}`}>
      <div className="dt-header">{day.day}</div>
      <div className="dt-icon"><img src={img} alt={day.day} width={40} height={40} /></div>
      <div className="dt-temp"><strong>{Math.round(day.max)}°</strong> <span className="muted">{Math.round(day.min)}°</span></div>
    </div>
  )
}

export default function ForecastStrip({ daily=[] }){
  // append first two days to the right so strip shows Mon/Tue again
  const extra = 2
  const extended = daily && daily.length ? daily.concat(daily.slice(0, extra)) : daily

  return (
    <div className="forecast-strip">
      {extended.map((d, i) => (
        <DayTile key={i} day={d} index={i} />
      ))}
    </div>
  )
}
