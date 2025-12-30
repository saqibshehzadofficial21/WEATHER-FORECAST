import React, { useMemo, useState, useEffect, useRef } from 'react'

// Expand hourly temps to minute-resolution by linear interpolation
function expandToMinutes(hourlyTemps){
  // hourlyTemps: [{temp, time}] length up to 24
  if(!hourlyTemps || hourlyTemps.length === 0) return []
  const minutes = []
  for(let i=0;i<hourlyTemps.length-1;i++){
    const a = hourlyTemps[i].temp
    const b = hourlyTemps[i+1].temp
    for(let m=0;m<60;m++){
      const t = a + (b - a) * (m/60)
      minutes.push(t)
    }
  }
  // push last hour value for the last minute
  const last = hourlyTemps[hourlyTemps.length-1].temp
  minutes.push(last)
  return minutes
}

function buildPoints(temps, w=800, h=120){
  if(!temps || temps.length===0) return ''
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const stepX = w / (temps.length-1 || 1)
  return temps.map((t,i) => {
    const x = i * stepX
    const y = h - ((t - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
}

export default function HourlyChart({ hourly=[] }){
  const minuteSeries = useMemo(() => expandToMinutes(hourly), [hourly])
  const lineRef = useRef(null)
  const [points, setPoints] = useState('')

  useEffect(() => {
    const p = buildPoints(minuteSeries, 1200, 160)
    setPoints(p)
  }, [minuteSeries])

  // animate stroke draw
  useEffect(() => {
    const el = lineRef.current
    if(!el) return
    try{
      const len = el.getTotalLength()
      el.style.transition = 'none'
      el.style.strokeDasharray = len
      el.style.strokeDashoffset = len
      // trigger a frame then animate
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 900ms ease-out'
        el.style.strokeDashoffset = '0'
      })
    }catch(e){}
  }, [points])

  return (
    <div className="hourly-chart card">
      <svg viewBox="0 0 1200 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8ad0c2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2b6a88" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {points && <polyline ref={lineRef} className="chart-line" points={points} fill="none" stroke="#9fe3c9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        {points && <polygon className="chart-area" points={`${points} 1200,160 0,160`} fill="url(#g1)" opacity="0.95" />}
      </svg>
    </div>
  )
}
