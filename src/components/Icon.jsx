import React from 'react'

export default function Icon({ type = 'partly', size = 48 }){
  const t = ('' + type).toLowerCase()

  function normalize(s){
    if(/rain|drizzle|shower|thunder|storm|sleet|downpour/.test(s)) return 'rain'
    if(/snow|sleet|blizzard/.test(s)) return 'rain'
    if(/cloud|overcast|fog|mist|haze/.test(s)) return 'cloud'
    if(/clear|sun|partly|mainly|fair/.test(s)) return 'sun'
    return 'sun'
  }

  const key = normalize(t)

  if(key === 'sun') return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="12" fill="#FFC857" />
      <g stroke="#FFD77A" strokeWidth="2" strokeLinecap="round">
        <path d="M32 4v6" />
        <path d="M32 54v6" />
        <path d="M4 32h6" />
        <path d="M54 32h6" />
        <path d="M10 10l4 4" />
        <path d="M50 50l4 4" />
        <path d="M50 14l4-4" />
        <path d="M10 54l4-4" />
      </g>
    </svg>
  )

  if(key === 'cloud') return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="38" cy="36" rx="18" ry="12" fill="#C7D2E0" />
      <ellipse cx="24" cy="36" rx="12" ry="9" fill="#E3EDF7" />
    </svg>
  )

  // rain (covers snow/thunderfall mapped as rain per user request)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="36" cy="28" rx="18" ry="12" fill="#9FD3EB" />
      <g stroke="#69B3D6" strokeWidth="3" strokeLinecap="round">
        <path d="M24 38c1.2 3 3 6 4 8" />
        <path d="M34 38c1.2 3 3 6 4 8" />
        <path d="M44 38c1.2 3 3 6 4 8" />
      </g>
    </svg>
  )
}
