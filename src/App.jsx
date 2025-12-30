import React, { useContext, useEffect } from 'react'
import { AppProvider, AppContext } from './context/AppContext'
import WeatherDashboard from './components/WeatherDashboard'

function AppInner(){
  const { theme } = useContext(AppContext)

  useEffect(() => {
    if(theme === 'light') document.documentElement.setAttribute('data-theme','light')
    else document.documentElement.setAttribute('data-theme','dark')
  }, [theme])

  return (
    <div className="page">
      <div className="app">
        <header>
          <h1>Weather Dashboard</h1>
        </header>
        <main>
          <WeatherDashboard />
        </main>
      </div>
      <div className="glow-decor" aria-hidden="true" />
    </div>
  )
}

export default function App(){
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
