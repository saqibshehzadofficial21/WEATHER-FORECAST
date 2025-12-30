import React, { useEffect, useState } from 'react'

export default function ContinentView({ cities }){
  const defaultCities = cities || [
    { name: 'Islamabad', lat:33.6844, lon:73.0479 },
    { name: 'Lahore', lat:31.5204, lon:74.3587 },
    { name: 'Karachi', lat:24.8607, lon:67.0011 },
    { name: 'Peshawar', lat:34.0151, lon:71.5249 },
    { name: 'Quetta', lat:30.1798, lon:66.9750 },
    { name: 'Multan', lat:30.1575, lon:71.5249 },
    { name: 'Faisalabad', lat:31.4180, lon:73.0774 },
  ]

  const [data, setData] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load(){
      const list = defaultCities
      const promises = list.map(async c => {
        try{
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current_weather=true`
          const res = await fetch(url)
          const j = await res.json()
          return { ...c, temp: j.current_weather?.temperature ?? null }
        }catch(e){
          return { ...c, temp: null }
        }
      })
      const results = await Promise.all(promises)
      if(!cancelled) setData(results)
    }
    load()
    const t = setInterval(load, 60_000) // refresh minute
    return () => { cancelled = true; clearInterval(t) }
  }, [])

  const temps = data.map(d => d.temp).filter(t=>typeof t === 'number')
  const min = temps.length ? Math.min(...temps) : 0
  const max = temps.length ? Math.max(...temps) : 40

  function normalize(t){
    if(t==null) return 0
    return (t - min) / (max - min || 1)
  }

  return (
    <div className="continent-view card">
      <h3>Pakistan Overview (3D tiles)</h3>
      <div className="continent-grid">
        {data.map((c,i)=>{
          const n = normalize(c.temp)
          const z = 10 + n*40
          return (
            <div key={i} className="continent-tile" style={{transform:`translateZ(${z}px) translateY(${ -n*8 }px)`}}>
              <div className="ct-name">{c.name}</div>
              <div className="ct-temp">{c.temp==null? '—' : Math.round(c.temp)+'°C'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
