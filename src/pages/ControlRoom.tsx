import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { Activity, BellRing, Flame, HeartPulse, MapPin, Radio, Users } from 'lucide-react'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

function fetchIncidents(){
  return JSON.parse(localStorage.getItem('incidents')||'[]')
}

export default function ControlRoom(){
  const [incidents, setIncidents] = useState<any[]>(fetchIncidents())
  const [units, setUnits] = useState<any[]>(JSON.parse(localStorage.getItem('units')||'[]'))
  const [alerts, setAlerts] = useState<any[]>(JSON.parse(localStorage.getItem('alerts')||'[]'))

  useEffect(()=>{
    const iv = setInterval(()=>{
      setIncidents(fetchIncidents())
      setUnits(JSON.parse(localStorage.getItem('units')||'[]'))
      setAlerts(JSON.parse(localStorage.getItem('alerts')||'[]'))
    },3000)
    return ()=>clearInterval(iv)
  },[])

  const stats = useMemo(() => ([
    { label: 'Active Incidents', value: incidents.length, icon: BellRing, accent: 'bg-red-50 text-red-600' },
    { label: 'Units Deployed', value: units.length, icon: Users, accent: 'bg-orange-50 text-orange-600' },
    { label: 'Alerts Sent', value: alerts.length, icon: Radio, accent: 'bg-amber-50 text-amber-600' },
    { label: 'Critical P1', value: incidents.filter(incident => incident.severity === 'P1').length, icon: HeartPulse, accent: 'bg-rose-50 text-rose-600' },
  ]), [alerts.length, incidents, units.length])

  return (
    <div className="page-shell p-4 sm:p-6 lg:p-8">
      <header className="glass-panel mb-6 overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              <Activity className="h-4 w-4" /> Live operations
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950">Control Room Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">Unified visibility for incidents, units, and inter-agency coordination. Every report from Pilgrim view appears here within seconds.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(stat => (
                <div key={stat.label} className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
                  <div className={`inline-flex rounded-2xl p-2 ${stat.accent}`}><stat.icon className="h-5 w-5" /></div>
                  <div className="mt-4 text-3xl font-black text-gray-950">{stat.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <SmartImage
            src={IMAGES.command}
            alt="Operations command room"
            fallbackTitle="Control Room"
            fallbackSubtitle="Live operations dashboard"
            className="h-full min-h-[260px] w-full object-cover"
          />
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[0.34fr_1fr_0.32fr]">
        <aside className="space-y-6">
          <div className="glass-panel overflow-hidden rounded-[2rem]">
            <div className="h-40 bg-gradient-to-br from-slate-900 via-orange-700 to-amber-500 p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">Alert Feed</div>
              <div className="mt-2 max-w-xs text-lg font-bold leading-6">Structured inter-agency alerts in one place</div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-950"><MapPin className="h-4 w-4 text-orange-500" /> Inter-Agency Alert Feed</div>
              <div className="mt-4 space-y-3">
                {alerts.map((alert:any) => (
                  <div key={alert.id} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">{alert.from} → {alert.to}</div>
                    <div className="mt-1 text-sm text-gray-600">{alert.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-950"><Flame className="h-4 w-4 text-orange-500" /> Live status</div>
            <div className="mt-4 grid gap-3 text-sm text-gray-600">
              <div className="rounded-2xl bg-orange-50 p-3">P1 escalations are auto-highlighted.</div>
              <div className="rounded-2xl bg-gray-50 p-3">Assignments update localStorage every cycle.</div>
              <div className="rounded-2xl bg-amber-50 p-3">Reminder: keep visuals light and reserve photos for hero sections.</div>
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-panel overflow-hidden rounded-[2rem] p-4">
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Live map</div>
                <h2 className="text-xl font-bold text-gray-950">Ram Ghat · Ujjain</h2>
              </div>
              <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Streaming every 3s</div>
            </div>
            <div className="h-[540px] overflow-hidden rounded-[1.5rem] border border-gray-200">
              <MapContainer center={[23.1828,75.7682]} zoom={15} style={{height: '100%', width: '100%'}}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {incidents.slice(0,10).map((inc:any, index:number)=> (
                  <Marker key={inc.id} position={[23.1828 + (index * 0.001), 75.7682 + (index % 3) * 0.0012]}>
                    <Popup>
                      <div className="space-y-1">
                        <div className="font-bold text-gray-950">{inc.type} · {inc.severity}</div>
                        <div className="text-sm text-gray-500">{inc.location}</div>
                        <div className="text-xs text-gray-500">{inc.summary}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Incident feed</div>
                <h3 className="text-xl font-bold text-gray-950">Newest first</h3>
              </div>
              <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">{incidents.length} reports</div>
            </div>
            <div className="grid gap-3">
              {incidents.map((inc:any) => (
                <div key={inc.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-gray-950">{inc.type}</div>
                      <div className="mt-1 text-xs text-gray-500">{inc.location}</div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] ${inc.severity === 'P1' ? 'bg-red-50 text-red-700' : inc.severity === 'P2' ? 'bg-orange-50 text-orange-700' : 'bg-amber-50 text-amber-700'}`}>
                      {inc.severity}
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">{inc.summary}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{new Date(inc.time).toLocaleTimeString()}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-600">{inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-5">
            <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-5 text-white shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-50">Resource tracker</div>
              <div className="mt-2 text-lg font-bold">Live units and availability</div>
            </div>
            <div className="p-0 pt-5">
              <div className="text-sm font-bold text-gray-950">Resource Tracker</div>
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                {units.map((unit:any) => (
                  <div key={unit.id} className="rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{unit.name}</span>
                      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-green-700">{unit.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">{unit.type} · {unit.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-5">
            <div className="text-sm font-bold text-gray-950">Daily posture</div>
            <div className="mt-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 p-4 text-white shadow-lg">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-50">AI summary</div>
              <div className="mt-2 text-sm leading-6 text-white/95">Traffic near Ram Ghat remains the highest risk. Pre-stage ambulances on the south corridor and keep fire support near the northern lane.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
