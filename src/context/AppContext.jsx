import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }){
  const [unit, setUnit] = useState(() => {
    try{ return localStorage.getItem('wf_unit') || 'C' }catch(e){ return 'C' }
  })
  const [refreshTime, setRefreshTime] = useState(() => {
    try{ const v = localStorage.getItem('wf_refresh'); return v ? Number(v) : 10000 }catch(e){ return 10000 }
  })
  const [theme, setTheme] = useState(() => {
    try{ return localStorage.getItem('wf_theme') || 'dark' }catch(e){ return 'dark' }
  })

  // persist preferences
  useEffect(() => { try{ localStorage.setItem('wf_unit', unit) }catch(e){} }, [unit])
  useEffect(() => { try{ localStorage.setItem('wf_refresh', String(refreshTime)) }catch(e){} }, [refreshTime])
  useEffect(() => { try{ localStorage.setItem('wf_theme', theme) }catch(e){} }, [theme])

  const value = {
    unit,
    refreshTime,
    theme,
    setUnit,
    setRefreshTime,
    setTheme
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
