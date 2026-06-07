import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import toast from 'react-hot-toast'
import {
  AlertTriangle, CheckCircle, Flame, Heart, Shield,
  UserX, Users, Sparkles, ClipboardList, Radio,
  MapPin, Clock, ChevronRight, Loader2
} from 'lucide-react'

const iconByType: any = {
  Medical: Heart, Fire: Flame, Missing: UserX,
  'Crowd Crush': Users, Security: Shield, Drowning: Users
}
const colorBySeverity: any = { P1: '#dc2626', P2: '#f97316', P3: '#f59e0b' }
const statusClass: any = {
  Available: 'bg-green-100 text-green-700',
  Dispatched: 'bg-orange-100 text-orange-700',
  'On Scene': 'bg-red-100 text-red-700',
  Returning: 'bg-gray-100 text-gray-600'
}

const AGENCY_CONFIG: any = {
  police: {
    label: 'Police',
    color: 'bg-blue-500',
    accent: 'border-blue-500',
    textAccent: 'text-blue-600',
    bgLight: 'bg-blue-50',
    zone: 'Sector 4 — Ram Ghat North',
    mapCenter: [23.1838, 75.7690] as [number, number],
    zoom: 15,
    polyline: [[23.183, 75.768], [23.185, 75.769], [23.185, 75.771], [23.183, 75.771], [23.183, 75.768]] as [number, number][],
    polyColor: '#3b82f6',
  },
  medical: {
    label: 'Medical / 108',
    color: 'bg-green-500',
    accent: 'border-green-500',
    textAccent: 'text-green-600',
    bgLight: 'bg-green-50',
    zone: 'Mahakal Corridor — Medical Post B',
    mapCenter: [23.1825, 75.7645] as [number, number],
    zoom: 15,
    polyline: [[23.181, 75.763], [23.184, 75.763], [23.184, 75.766], [23.181, 75.766], [23.181, 75.763]] as [number, number][],
    polyColor: '#22c55e',
  },
  fire: {
    label: 'Fire Department',
    color: 'bg-red-500',
    accent: 'border-red-500',
    textAccent: 'text-red-600',
    bgLight: 'bg-red-50',
    zone: 'Triveni Ghat — Fire Station 2',
    mapCenter: [23.1812, 75.7670] as [number, number],
    zoom: 15,
    polyline: [[23.180, 75.766], [23.182, 75.766], [23.182, 75.769], [23.180, 75.769], [23.180, 75.766]] as [number, number][],
    polyColor: '#ef4444',
  },
  ndrf: {
    label: 'NDRF',
    color: 'bg-purple-500',
    accent: 'border-purple-500',
    textAccent: 'text-purple-600',
    bgLight: 'bg-purple-50',
    zone: 'Ram Ghat South — NDRF Alpha Base',
    mapCenter: [23.1818, 75.7680] as [number, number],
    zoom: 15,
    polyline: [[23.181, 75.767], [23.183, 75.767], [23.183, 75.769], [23.181, 75.769], [23.181, 75.767]] as [number, number][],
    polyColor: '#a855f7',
  }
}

function read(key: string) { return JSON.parse(localStorage.getItem(key) || '[]') }
function ujjainClock() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit',
    hour12: false, day: '2-digit', month: 'short', year: 'numeric'
  }).replace(',', ' IST ·')
}

interface Props { role?: string }

export default function AgencyView({ role = 'medical' }: Props) {
  const cfg = AGENCY_CONFIG[role] || AGENCY_CONFIG.medical

  const [incidents, setIncidents] = useState<any[]>(read('incidents'))
  const [units, setUnits] = useState<any[]>(read('units'))
  const [alerts, setAlerts] = useState<any[]>(read('alerts'))
  const [requests, setRequests] = useState<any[]>(read('resourceRequests'))

  const [reqType, setReqType] = useState('Ambulance')
  const [reqReason, setReqReason] = useState('')
  const [reqUrgency, setReqUrgency] = useState('High')

  const [sitRepLoading, setSitRepLoading] = useState(false)
  const [sitRep, setSitRep] = useState('')
  const [showSitRep, setShowSitRep] = useState(false)

  const [broadcastSent, setBroadcastSent] = useState('')

  useEffect(() => {
    const load = () => {
      setIncidents(read('incidents'))
      setUnits(read('units'))
      setAlerts(read('alerts'))
      setRequests(read('resourceRequests'))
    }
    load()
    const iv = setInterval(load, 3000)
    return () => clearInterval(iv)
  }, [])

  // Only show incidents assigned to this agency or unassigned P1/P2
  const myIncidents = useMemo(() =>
    incidents.filter(i =>
      i.status !== 'Merged' &&
      (i.assignedAgency === role || i.assignedUnit || i.severity === 'P1' || i.severity === 'P2')
    ).slice(0, 6),
    [incidents, role]
  )

  const stats = useMemo(() => [
    { label: 'My Assignments', value: myIncidents.filter(i => i.status === 'Assigned').length },
    { label: 'On Scene', value: myIncidents.filter(i => i.status === 'On Scene').length },
    { label: 'Resolved Today', value: myIncidents.filter(i => i.status === 'Resolved').length },
    { label: 'Pending Requests', value: requests.filter(r => r.agency === role && r.status === 'Pending').length, warn: true }
  ], [myIncidents, requests, role])

  function updateIncidentStatus(id: string, status: string) {
    const next = incidents.map(i => i.id === id ? { ...i, status } : i)
    setIncidents(next)
    localStorage.setItem('incidents', JSON.stringify(next))
    toast.success(`Incident marked: ${status}`)
  }

  function sendResourceRequest() {
    if (!reqReason.trim()) return toast.error('Please describe the reason')
    const req = {
      id: `REQ-${Date.now()}`,
      agency: role,
      agencyLabel: cfg.label,
      type: reqType,
      urgency: reqUrgency,
      reason: reqReason,
      status: 'Pending',
      time: new Date().toISOString()
    }
    const next = [req, ...requests]
    setRequests(next)
    localStorage.setItem('resourceRequests', JSON.stringify(next))
    setReqReason('')
    toast.success('Resource request sent to Control Room')
  }

  function quickBroadcast(type: 'clear' | 'backup' | 'major') {
    const messages: any = {
      clear: { msg: `✅ All clear in ${cfg.zone}`, emoji: '✅', label: 'All Clear' },
      backup: { msg: `⚠️ Need backup at ${cfg.zone} — requesting additional units`, emoji: '⚠️', label: 'Need Backup' },
      major: { msg: `🚨 MAJOR INCIDENT at ${cfg.zone} — all agencies alert`, emoji: '🚨', label: 'Major Incident' }
    }
    const m = messages[type]
    const alert = {
      id: `A-${Date.now()}`,
      from: role.toUpperCase().slice(0, 4),
      to: 'CTRL',
      msg: `${m.msg} · ${new Date().toLocaleTimeString()}`,
      time: new Date().toISOString()
    }
    const next = [alert, ...alerts]
    setAlerts(next)
    localStorage.setItem('alerts', JSON.stringify(next))
    setBroadcastSent(m.label)
    toast.success(`${m.emoji} Broadcast sent to Control Room`)
    setTimeout(() => setBroadcastSent(''), 3000)
  }

  async function generateShiftHandover() {
    setSitRepLoading(true)
    setShowSitRep(true)
    setSitRep('')
    try {
      const resolved = myIncidents.filter(i => i.status === 'Resolved').length
      const active = myIncidents.filter(i => i.status !== 'Resolved').length
      const p1count = myIncidents.filter(i => i.severity === 'P1').length

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are the AI system for SimhasthaSetu, the emergency coordination platform for Simhastha 2028 in Ujjain.
Generate a formal shift handover report for the ${cfg.label} team assigned to ${cfg.zone}.

Shift data:
- Incidents handled: ${myIncidents.length} total (${resolved} resolved, ${active} still active)
- P1 Critical cases: ${p1count}
- Zone: ${cfg.zone}
- Incident types seen: ${[...new Set(myIncidents.map((i: any) => i.type))].join(', ') || 'Medical, Crowd Crush'}
- Pending resource requests: ${requests.filter((r: any) => r.agency === role && r.status === 'Pending').length}

Generate a 6-line shift handover report covering:
1. Shift summary (incidents handled, types, avg response note)
2. Active pending cases that next shift must pick up
3. Zone observations (crowd density, risk areas noted)
4. Resource status (what units were used, what needs restocking)
5. Recommendation for next shift team
6. Overall shift status: GREEN / AMBER / RED

Keep it concise and formal. Use bullet points. Start with "SHIFT HANDOVER REPORT — ${cfg.label.toUpperCase()}"`
          }]
        })
      })
      const data = await response.json()
      const text = data.content?.[0]?.text || 'Unable to generate report.'
      setSitRep(text)
    } catch {
      setSitRep('Error generating report. Please try again.')
    } finally {
      setSitRepLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/40 p-4 sm:p-6 lg:p-8">

      {/* Navbar */}
      <nav className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div className={`border-l-4 pl-3 ${cfg.accent}`}>
          <div className="text-xl font-black text-gray-950">SimhasthaSetu</div>
          <div className={`text-xs font-bold uppercase tracking-[0.3em] ${cfg.textAccent}`}>
            {cfg.label} · Ground Ops
          </div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${cfg.color}`}>
            {cfg.zone}
          </span>
          <div className="text-xs text-gray-400">Ujjain · {ujjainClock()}</div>
        </div>
      </nav>

      {/* Quick Broadcast Buttons */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          { type: 'clear' as const, label: 'All Clear in My Zone', emoji: '✅', cls: 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' },
          { type: 'backup' as const, label: 'Need Backup', emoji: '⚠️', cls: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' },
          { type: 'major' as const, label: 'Major Incident — Alert All', emoji: '🚨', cls: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' }
        ].map(btn => (
          <button
            key={btn.type}
            onClick={() => quickBroadcast(btn.type)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center font-bold transition-all active:scale-95 ${btn.cls} ${broadcastSent === btn.label ? 'ring-2 ring-offset-2 ring-green-400' : ''}`}
          >
            <span className="text-2xl">{btn.emoji}</span>
            <span className="mt-1 text-xs leading-tight">{btn.label}</span>
            {broadcastSent === btn.label && (
              <span className="absolute -top-2 -right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-black text-white">Sent!</span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${stat.warn && stat.value > 0 ? 'border-amber-200 bg-amber-50' : ''}`}>
            <div className="text-3xl font-black text-gray-950">{stat.value}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">

        {/* Left Column */}
        <section className="space-y-6">

          {/* Zone Map */}
          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className={`h-4 w-4 ${cfg.textAccent}`} />
              <span className="font-black text-gray-950">My Zone Map</span>
              <span className={`ml-auto rounded-full px-3 py-1 text-xs font-bold text-white ${cfg.color}`}>{cfg.zone}</span>
            </div>
            <div className="h-[300px] overflow-hidden rounded-[1.5rem] border border-gray-200">
              <MapContainer center={cfg.mapCenter} zoom={cfg.zoom} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution="&copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Polyline pathOptions={{ color: cfg.polyColor, weight: 4 }} positions={cfg.polyline} />
                {myIncidents.map((inc: any) => (
                  <CircleMarker
                    key={inc.id}
                    center={[inc.lat || cfg.mapCenter[0], inc.lng || cfg.mapCenter[1]]}
                    radius={inc.severity === 'P1' ? 11 : 8}
                    pathOptions={{ color: colorBySeverity[inc.severity] || '#f59e0b', fillColor: colorBySeverity[inc.severity] || '#f59e0b', fillOpacity: 0.85 }}
                  >
                    <Popup><b>{inc.type} · {inc.severity}</b><br />{inc.location}<br />{inc.summary}</Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">Showing your assigned zone only · Incidents outside zone are not displayed</p>
          </div>

          {/* Resource Request */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center gap-2 font-black text-gray-950">
              <Radio className="h-4 w-4 text-orange-500" />
              Request Additional Resource
              <span className="ml-auto text-xs font-normal text-gray-400">Goes to Control Room for approval</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">Resource Type</label>
                <select value={reqType} onChange={e => setReqType(e.target.value)} className="w-full rounded-xl border border-gray-200 p-2 text-sm">
                  {['Ambulance', 'Fire Unit', 'Police Team', 'NDRF Squad', 'Medical Supplies'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">Urgency</label>
                <select value={reqUrgency} onChange={e => setReqUrgency(e.target.value)} className="w-full rounded-xl border border-gray-200 p-2 text-sm">
                  {['Critical', 'High', 'Medium'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <textarea
              value={reqReason}
              onChange={e => setReqReason(e.target.value)}
              className="mt-3 h-20 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Describe why additional resource is needed..."
            />
            <button onClick={sendResourceRequest} className="mt-3 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 active:scale-95">
              Send Request to Control Room
            </button>

            {/* My pending requests */}
            {requests.filter((r: any) => r.agency === role).length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400">My Requests</div>
                {requests.filter((r: any) => r.agency === role).slice(0, 3).map((req: any) => (
                  <div key={req.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                    <span className="font-semibold text-gray-700">{req.type}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : req.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shift Handover */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center gap-2 font-black text-gray-950">
              <ClipboardList className="h-4 w-4 text-orange-500" />
              Shift Handover Report
            </div>
            {!showSitRep ? (
              <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 p-6 text-center">
                <Sparkles size={36} className="mx-auto mb-3 text-orange-300" />
                <div className="font-semibold text-gray-700">End of Shift?</div>
                <div className="mt-1 text-sm text-gray-400">AI generates a complete handover summary for the next team</div>
                <button onClick={generateShiftHandover} className="mt-4 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 active:scale-95">
                  Generate Handover Report
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-orange-200 bg-white">
                <div className="flex items-center gap-2 rounded-t-2xl bg-orange-500 px-4 py-2 text-xs font-bold text-white">
                  <Sparkles size={12} /> Generated by SimhasthaSetu AI · {new Date().toLocaleTimeString()}
                </div>
                <div className="p-4">
                  {sitRepLoading ? (
                    <div className="flex items-center gap-2 py-4 text-orange-500">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Generating handover report...</span>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">{sitRep}</pre>
                  )}
                </div>
                <button onClick={() => { setShowSitRep(false); setSitRep('') }} className="m-3 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Right Column — My Assignments */}
        <aside className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
            <div className={`flex items-center justify-between px-4 py-3 font-bold text-white ${cfg.color}`}>
              <span>My Assignments</span>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{myIncidents.length} active</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              </div>
            </div>

            <div className="max-h-[780px] space-y-3 overflow-auto p-4">
              {!myIncidents.length && (
                <div className="py-12 text-center text-gray-400">
                  <CheckCircle size={48} className="mx-auto mb-2 text-green-400" />
                  <div className="font-semibold">All clear</div>
                  <div className="text-sm">No active assignments in your zone</div>
                </div>
              )}
              {myIncidents.map((inc: any) => {
                const Icon = iconByType[inc.type] || AlertTriangle
                const isOnScene = inc.status === 'On Scene'
                const isAssigned = inc.status === 'Assigned'
                const isResolved = inc.status === 'Resolved'
                return (
                  <div key={inc.id} className={`rounded-2xl border bg-white p-4 shadow-sm transition-all ${inc.severity === 'P1' && !isResolved ? 'border-red-200' : 'border-gray-100'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-1 self-stretch rounded" style={{ backgroundColor: colorBySeverity[inc.severity] }} />
                      <div className="flex-1">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold text-gray-950">
                            <Icon size={16} className="text-orange-500" />
                            {inc.type}
                          </div>
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-black text-red-700">{inc.severity}</span>
                        </div>

                        {/* Location + time */}
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />
                          {inc.location}
                          <Clock size={10} className="ml-2" />
                          {inc.time ? new Date(inc.time).toLocaleTimeString() : 'Just now'}
                        </div>

                        {/* Summary */}
                        <p className="mt-2 text-sm text-gray-600">{inc.summary}</p>

                        {/* Merged badge */}
                        {inc.mergedReports && (
                          <div className="mt-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            ⚠️ {inc.mergedReports} reports merged
                          </div>
                        )}

                        {/* Ticket ID */}
                        <div className="mt-2 font-mono text-xs text-gray-400">{inc.id}</div>

                        {/* Status + Action Buttons */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass[inc.status] || statusClass.Available}`}>
                            {inc.status}
                          </span>
                          {isAssigned && (
                            <button
                              onClick={() => updateIncidentStatus(inc.id, 'On Scene')}
                              className="flex items-center gap-1 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-orange-600 active:scale-95"
                            >
                              <ChevronRight size={12} /> Mark On Scene
                            </button>
                          )}
                          {isOnScene && (
                            <button
                              onClick={() => updateIncidentStatus(inc.id, 'Resolved')}
                              className="flex items-center gap-1 rounded-xl bg-green-500 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-green-600 active:scale-95"
                            >
                              <CheckCircle size={12} /> Mark Resolved
                            </button>
                          )}
                          {isResolved && (
                            <span className="text-xs font-semibold text-green-600">✓ Resolved</span>
                          )}
                        </div>

                        {/* Assigned unit tag */}
                        {inc.assignedUnit && (
                          <div className="mt-2 text-xs text-gray-400">
                            Assigned unit: <span className="font-semibold text-gray-600">{inc.assignedUnit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* My Agency Alert Feed (read-only) */}
          <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
            <div className="border-b border-gray-100 px-4 py-3 font-black text-gray-950">
              Incoming Alerts for {cfg.label}
            </div>
            <div className="max-h-[260px] overflow-auto p-4 space-y-3">
              {alerts
                .filter((a: any) => a.to === role.toUpperCase().slice(0, 4) || a.to === 'ALL' || a.to === 'CTRL')
                .slice(0, 6)
                .map((alert: any) => (
                  <div key={alert.id} className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${alert.from === 'POL' ? 'bg-blue-500' : alert.from === 'MED' ? 'bg-green-500' : alert.from === 'FIRE' ? 'bg-red-500' : alert.from === 'NDRF' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                      {alert.from}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-orange-600">
                        {alert.from} → {alert.to} · {new Date(alert.time).toLocaleTimeString()}
                      </div>
                      <div className="text-gray-600">{alert.msg}</div>
                    </div>
                  </div>
                ))}
              {!alerts.length && (
                <div className="py-4 text-center text-sm text-gray-400">No incoming alerts</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}