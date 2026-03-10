'use client'

import { useState } from 'react'

interface TripPlan {
  tripName: string
  summary: string
  distance: string
  bestSeason: string
  estimatedDays: string
  route: {
    overview: string
    waypoints: { name: string; description: string }[]
  }
  weather: {
    typicalConditions: string
    windPatterns: string
    hazards: string
    tip: string
  }
  checklist: {
    safety: string[]
    navigation: string[]
    provisions: string[]
    documents: string[]
  }
  costs: {
    fuel: string
    marina: string
    provisions: string
    total: string
    currency: string
  }
  tips: { title: string; body: string }[]
  affiliateContext: {
    boatRentalNeeded: boolean
    insuranceRecommended: boolean
    gearSuggestions: string[]
  }
}

export default function Home() {
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('')
  const [boatType, setBoatType] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(false)
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null)
  const [error, setError] = useState('')

  const handlePlan = async () => {
    if (!departure.trim() || !destination.trim()) {
      setError('Please enter both departure and destination ports.')
      return
    }
    setError('')
    setLoading(true)
    setTripPlan(null)

    try {
      const res = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departure, destination, duration, boatType, experience }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setTripPlan(data.tripPlan)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Background */}
      <div className="ocean-bg">
        <div className="wave-lines" />
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="pt-12 pb-6 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" stroke="#4db6ac" strokeWidth="1.5" strokeOpacity="0.6"/>
              <path d="M18 4 L18 32 M4 18 L32 18" stroke="#4db6ac" strokeWidth="1" strokeOpacity="0.4"/>
              <circle cx="18" cy="18" r="3" fill="#c9a84c"/>
              <path d="M18 8 L22 18 L18 16 L14 18 Z" fill="#4db6ac"/>
            </svg>
            <span className="font-display text-2xl tracking-widest text-cream" style={{letterSpacing: '0.2em'}}>SKIPPER</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-cream mb-3" style={{lineHeight: 1.15}}>
            Chart Your Course
          </h1>
          <p className="text-mist text-lg font-light max-w-lg mx-auto" style={{color: 'var(--mist)'}}>
            AI-powered trip planning for sailors and boaters. Routes, weather, checklists, and costs — in seconds.
          </p>
        </header>

        {/* Main Form */}
        <main className="max-w-2xl mx-auto px-4 pb-16">
          <div className="glass-card gold-border p-7 mb-6 fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                  Departure Port
                </label>
                <input
                  className="nautical-input"
                  placeholder="e.g. Miami, FL"
                  value={departure}
                  onChange={e => setDeparture(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                  Destination
                </label>
                <input
                  className="nautical-input"
                  placeholder="e.g. Nassau, Bahamas"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                  Duration
                </label>
                <select
                  className="nautical-input"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={{cursor: 'pointer'}}
                >
                  <option value="">Flexible</option>
                  <option value="weekend">Weekend</option>
                  <option value="1 week">1 Week</option>
                  <option value="2 weeks">2 Weeks</option>
                  <option value="1 month">1 Month</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                  Vessel Type
                </label>
                <select
                  className="nautical-input"
                  value={boatType}
                  onChange={e => setBoatType(e.target.value)}
                  style={{cursor: 'pointer'}}
                >
                  <option value="">Sailboat</option>
                  <option value="powerboat">Powerboat</option>
                  <option value="catamaran">Catamaran</option>
                  <option value="motor yacht">Motor Yacht</option>
                  <option value="dinghy">Dinghy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{color: 'var(--mist)', letterSpacing: '0.08em', textTransform: 'uppercase'}}>
                  Experience
                </label>
                <select
                  className="nautical-input"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  style={{cursor: 'pointer'}}
                >
                  <option value="">Intermediate</option>
                  <option value="beginner">Beginner</option>
                  <option value="advanced">Advanced</option>
                  <option value="offshore captain">Offshore Captain</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.3)', color: '#f87171'}}>
                {error}
              </div>
            )}

            <button
              className="btn-primary w-full text-center"
              onClick={handlePlan}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="flex gap-1 items-end">
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                    <span className="wave-bar" />
                  </span>
                  Plotting your course...
                </span>
              ) : (
                '⚓ Plan My Trip'
              )}
            </button>
          </div>

          {/* Results */}
          {tripPlan && (
            <div className="space-y-5">
              {/* Trip Header */}
              <div className="glass-card gold-border p-7 fade-up">
                <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <span className="section-tag mb-2 block" style={{width: 'fit-content'}}>Your Voyage</span>
                    <h2 className="font-display text-3xl text-cream">{tripPlan.tripName}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display" style={{color: 'var(--gold)'}}>{tripPlan.costs.total}</div>
                    <div className="text-xs" style={{color: 'var(--mist)'}}>estimated total</div>
                  </div>
                </div>
                <p className="leading-relaxed mb-5" style={{color: 'var(--mist)'}}>{tripPlan.summary}</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Distance', value: tripPlan.distance, icon: '📍' },
                    { label: 'Best Season', value: tripPlan.bestSeason, icon: '🌤' },
                    { label: 'Est. Duration', value: tripPlan.estimatedDays, icon: '🗓' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-3 rounded-lg" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                      <div className="text-lg mb-1">{stat.icon}</div>
                      <div className="font-medium text-sm text-cream">{stat.value}</div>
                      <div className="text-xs mt-1" style={{color: 'var(--mist)'}}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Route */}
              <div className="glass-card p-6 fade-up fade-up-delay-1">
                <span className="section-tag mb-3 block" style={{width: 'fit-content'}}>Route Plan</span>
                <p className="mb-4 text-sm leading-relaxed" style={{color: 'var(--mist)'}}>{tripPlan.route.overview}</p>
                <div className="space-y-3">
                  {tripPlan.route.waypoints.map((wp, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background: 'rgba(77,182,172,0.15)', color: 'var(--seafoam)', border: '1px solid rgba(77,182,172,0.3)'}}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-cream">{wp.name}</div>
                        <div className="text-xs mt-0.5 leading-relaxed" style={{color: 'var(--mist)'}}>{wp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather */}
              <div className="glass-card p-6 fade-up fade-up-delay-2">
                <span className="section-tag mb-4 block" style={{width: 'fit-content'}}>Weather & Conditions</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {[
                    { label: 'Typical Conditions', value: tripPlan.weather.typicalConditions },
                    { label: 'Wind Patterns', value: tripPlan.weather.windPatterns },
                    { label: 'Watch For', value: tripPlan.weather.hazards },
                    { label: 'Pro Tip', value: tripPlan.weather.tip },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'}}>
                      <div className="text-xs font-medium mb-1" style={{color: 'var(--seafoam)'}}>{item.label}</div>
                      <div className="text-sm leading-relaxed" style={{color: 'var(--mist)'}}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Costs */}
              <div className="glass-card p-6 fade-up fade-up-delay-3">
                <span className="section-tag mb-4 block" style={{width: 'fit-content'}}>Cost Estimate</span>
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Fuel', value: tripPlan.costs.fuel },
                    { label: 'Marina & Anchorage', value: tripPlan.costs.marina },
                    { label: 'Provisions', value: tripPlan.costs.provisions },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2" style={{borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
                      <span className="text-sm" style={{color: 'var(--mist)'}}>{item.label}</span>
                      <span className="text-sm font-medium text-cream">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium text-cream">Total Estimate</span>
                    <span className="text-lg font-display" style={{color: 'var(--gold)'}}>{tripPlan.costs.total}</span>
                  </div>
                </div>

                {/* Affiliate CTAs */}
                <div className="mt-5 p-4 rounded-xl" style={{background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)'}}>
                  <p className="text-xs font-medium mb-3" style={{color: 'var(--gold)'}}>Ready to set sail?</p>
                  <div className="flex flex-wrap gap-2">
                    {tripPlan.affiliateContext.boatRentalNeeded && (
                      <a
                        href="https://www.boatsetter.com/?ref=skipper"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{background: 'rgba(37,99,168,0.3)', color: 'var(--cream)', border: '1px solid rgba(37,99,168,0.4)', textDecoration: 'none'}}
                      >
                        🛥 Find a Boat on Boatsetter
                      </a>
                    )}
                    {tripPlan.affiliateContext.insuranceRecommended && (
                      <a
                        href="https://www.boatus.com/insurance/?ref=skipper"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                        style={{background: 'rgba(77,182,172,0.15)', color: 'var(--seafoam)', border: '1px solid rgba(77,182,172,0.3)', textDecoration: 'none'}}
                      >
                        🛡 Get Trip Insurance
                      </a>
                    )}
                    <a
                      href="https://www.westmarine.com/?ref=skipper"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-80"
                      style={{background: 'rgba(255,255,255,0.05)', color: 'var(--mist)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none'}}
                    >
                      ⚓ Marine Gear
                    </a>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="glass-card p-6 fade-up">
                <span className="section-tag mb-4 block" style={{width: 'fit-content'}}>Trip Checklist</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { title: '⛑ Safety', items: tripPlan.checklist.safety },
                    { title: '🧭 Navigation', items: tripPlan.checklist.navigation },
                    { title: '🥫 Provisions', items: tripPlan.checklist.provisions },
                    { title: '📄 Documents', items: tripPlan.checklist.documents },
                  ].map(section => (
                    <div key={section.title}>
                      <h4 className="text-sm font-medium mb-2 text-cream">{section.title}</h4>
                      <ul className="space-y-1">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{color: 'var(--mist)'}}>
                            <span className="mt-0.5 flex-shrink-0" style={{color: 'var(--seafoam)'}}>✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="glass-card p-6 fade-up">
                <span className="section-tag mb-4 block" style={{width: 'fit-content'}}>Skipper's Tips</span>
                <div className="space-y-4">
                  {tripPlan.tips.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 text-lg">💡</div>
                      <div>
                        <div className="text-sm font-medium text-cream mb-1">{tip.title}</div>
                        <div className="text-sm leading-relaxed" style={{color: 'var(--mist)'}}>{tip.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan another trip */}
              <div className="text-center pt-2 pb-4">
                <button
                  onClick={() => { setTripPlan(null); setDeparture(''); setDestination('') }}
                  className="text-sm underline-offset-2 hover:underline transition-all"
                  style={{color: 'var(--mist)', background: 'none', border: 'none', cursor: 'pointer'}}
                >
                  ← Plan another voyage
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 px-4" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
          <p className="text-xs" style={{color: 'var(--mist)', opacity: 0.5}}>
            © {new Date().getFullYear()} Skipper.com — AI-Powered Nautical Trip Planning
          </p>
        </footer>
      </div>
    </>
  )
}
