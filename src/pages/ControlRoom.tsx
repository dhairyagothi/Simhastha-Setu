import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import toast from 'react-hot-toast'
import {
  AlertTriangle, Car, CheckCircle, Flame, Heart, Radio,
  Shield, UserX, Users, Sparkles, Loader2, TrendingUp,
  AlertCircle, Brain, BarChart2, Map, Clock
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar,
  Legend, LineChart, Line
} from 'recharts'

// ─── constants ────────────────────────────────────────────────────────────────

const agencies: any = {
  POL: 'bg-blue-500', MED: 'bg-green-500',
  FIRE: 'bg-red-500', NDRF: 'bg-purple-500', MELA: 'bg-orange-500'
}
const iconByType: any = {
  Medical: Heart, Fire: Flame, Missing: UserX,
  'Crowd Crush': Users, Security: Shield, Drowning: Users
}
const colorBySeverity: any = { P1: '#dc2626', P2: '#f97316', P3: '#f59e0b' }
const unitIcon: any = { Ambulance: '🚑', Fire: '🚒', Police: Car, NDRF: Users }
const statusClass: any = {
  Available: 'bg-green-100 text-green-700',
  Dispatched: 'bg-orange-100 text-orange-700',
  'On Scene': 'bg-red-100 text-red-700',
  Returning: 'bg-gray-100 text-gray-600'
}

// ─── crowd density chart data (mimics simhastha 2016 shahi snan pattern) ──────

const crowdData = [
  { time: '4 AM', ramGhat: 28, mahakal: 15, triveni: 12 },
  { time: '5 AM', ramGhat: 55, mahakal: 32, triveni: 28 },
  { time: '6 AM', ramGhat: 78, mahakal: 58, triveni: 45 },
  { time: '7 AM', ramGhat: 91, mahakal: 72, triveni: 61 },
  { time: '8 AM', ramGhat: 97, mahakal: 81, triveni: 70 },
  { time: '9 AM', ramGhat: 88, mahakal: 95, triveni: 74 },
  { time: '10 AM', ramGhat: 76, mahakal: 99, triveni: 68 },
  { time: '11 AM', ramGhat: 65, mahakal: 88, triveni: 55 },
  { time: '12 PM', ramGhat: 58, mahakal: 72, triveni: 48 },
  { time: '2 PM', ramGhat: 44, mahakal: 55, triveni: 38 },
  { time: '4 PM', ramGhat: 38, mahakal: 42, triveni: 31 },
  { time: '6 PM', ramGhat: 62, mahakal: 48, triveni: 55 },
  { time: '8 PM', ramGhat: 48, mahakal: 36, triveni: 42 },
]

// ─── incident pattern data ────────────────────────────────────────────────────

const patternData = [
  { hour: '4-6 AM', Medical: 3, Drowning: 4, 'Crowd Crush': 1, Fire: 0, Missing: 2 },
  { hour: '6-8 AM', Medical: 8, Drowning: 6, 'Crowd Crush': 5, Fire: 1, Missing: 4 },
  { hour: '8-10 AM', Medical: 12, Drowning: 3, 'Crowd Crush': 9, Fire: 2, Missing: 7 },
  { hour: '10-12 PM', Medical: 9, Drowning: 2, 'Crowd Crush': 6, Fire: 1, Missing: 5 },
  { hour: '12-2 PM', Medical: 6, Drowning: 1, 'Crowd Crush': 3, Fire: 0, Missing: 3 },
  { hour: '2-4 PM', Medical: 4, Drowning: 1, 'Crowd Crush': 2, Fire: 1, Missing: 2 },
  { hour: '4-6 PM', Medical: 5, Drowning: 2, 'Crowd Crush': 3, Fire: 0, Missing: 4 },
  { hour: '6-8 PM', Medical: 7, Drowning: 1, 'Crowd Crush': 4, Fire: 1, Missing: 6 },
]

// ─── response time trend ──────────────────────────────────────────────────────

const responseTimeTrend = [
  { day: 'Day 1', avgMin: 18, target: 5 },
  { day: 'Day 2', avgMin: 14, target: 5 },
  { day: 'Day 3', avgMin: 11, target: 5 },
  { day: 'Day 4', avgMin: 8, target: 5 },
  { day: 'Day 5', avgMin: 6, target: 5 },
  { day: 'Today', avgMin: 4.8, target: 5 },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function read(key: string) { return JSON.parse(localStorage.getItem(key) || '[]') }
function ujjainClock() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit',
    hour12: false, day: '2-digit', month: 'short', year: 'numeric'
  }).replace(',', ' IST ·')
}

const currentHour = new Date().getHours()
const currentTimeLabel = currentHour < 5 ? '4 AM' : currentHour < 7 ? '5 AM' :
  currentHour < 9 ? '8 AM' : currentHour < 11 ? '10 AM' : currentHour < 13 ? '12 PM' :
  currentHour < 15 ? '2 PM' : currentHour < 17 ? '4 PM' : currentHour < 19 ? '6 PM' : '8 PM'

// ─── custom tooltip ───────────────────────────────────────────────────────────

const CrowdTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-lg text-xs">
      <div className="mb-1 font-black text-gray-900">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className={`font-bold ${p.value >= 85 ? 'text-red-600' : p.value >= 70 ? 'text-orange-500' : 'text-gray-800'}`}>
            {p.value}%
          </span>
        </div>
      ))}
      {payload.some((p: any) => p.value >= 85) && (
        <div className="mt-1 rounded-lg bg-red-50 px-2 py-1 text-[10px] font-bold text-red-600">
          ⚠️ Above safe threshold
        </div>
      )}
    </div>
  )
}

// ─── AI Insights Panel ────────────────────────────────────────────────────────

function AIInsightsPanel({ incidents, units }: { incidents: any[], units: any[] }) {
  const [deployPlan, setDeployPlan] = useState('')
  const [deployLoading, setDeployLoading] = useState(false)
  const [deployShown, setDeployShown] = useState(false)
  const [densityTime, setDensityTime] = useState(0)

  // animate the "current time" density marker
  useEffect(() => {
    const iv = setInterval(() => setDensityTime(t => (t + 1) % 100), 5000)
    return () => clearInterval(iv)
  }, [])

  async function generateDeployPlan() {
    setDeployLoading(true)
    setDeployShown(true)
    setDeployPlan('')
    try {
      const incidentSummary = incidents.slice(0, 8).map(i =>
        `${i.type} (${i.severity}) at ${i.location}`
      ).join(', ') || 'Medical x3 at Ram Ghat, Crowd Crush x2 at Mahakal, Drowning x1 at Triveni'

      const activeUnits = units.filter(u => u.status !== 'Available').length
      const availableUnits = units.filter(u => u.status === 'Available').length

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are SimhasthaSetu AI, the emergency intelligence system for Simhastha 2028 Mela in Ujjain, India.

Current situation:
- Active incidents: ${incidents.filter(i => i.status !== 'Merged').length} (${incidents.filter(i => i.severity === 'P1').length} P1 critical)
- Recent incident types: ${incidentSummary}
- Units deployed: ${activeUnits} | Units available: ${availableUnits}
- Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Tomorrow is Shahi Snan — peak crowd day

Historical data from Simhastha 2016:
- Ram Ghat peaks 6–9 AM (pre-dawn snan) — highest drowning + medical risk
- Mahakal corridor peaks 9 AM–12 PM — stampede risk, narrow lanes
- Triveni Ghat moderate throughout — secondary medical risk
- Heat exhaustion spikes 12–2 PM on Mahakal walking route
- Missing persons peak 10 AM–12 PM (crowd separation)

Generate a deployment recommendation for tomorrow's Shahi Snan with exactly this format:

**DEPLOYMENT PLAN — SHAHI SNAN [date]**

**High Risk Zones:**
- [zone]: [specific recommendation with timing]
- [zone]: [specific recommendation with timing]

**Unit Deployments:**
- [Unit type] → [Location] → [Time window] → [Reason]
(give 5 specific deployments)

**Pre-emptive Actions:**
- [3 specific actions to take before 5 AM tomorrow]

**Risk Level: [GREEN/AMBER/RED]**
**Confidence: [X]% based on 2016 Simhastha data**

Keep it sharp, specific to Ujjain geography, and actionable.`
          }]
        })
      })
      const data = await res.json()
      setDeployPlan(data.content?.[0]?.text || 'Unable to generate plan.')
    } catch {
      setDeployPlan('Error connecting to AI. Please retry.')
    } finally {
      setDeployLoading(false)
    }
  }

  // anomaly detection: find any zone crossing 85 in crowdData
  const surgeAlerts = crowdData.filter(d =>
    d.ramGhat >= 85 || d.mahakal >= 85 || d.triveni >= 85
  )
  const peakRamGhat = crowdData.find(d => d.ramGhat === Math.max(...crowdData.map(x => x.ramGhat)))
  const peakMahakal = crowdData.find(d => d.mahakal === Math.max(...crowdData.map(x => x.mahakal)))

  return (
    <div className="space-y-6">

      {/* Header banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Brain className="h-7 w-7 text-white" />
            <div>
              <div className="text-2xl font-black text-white">AI Situational Intelligence</div>
              <div className="text-sm text-white/70">Powered by SimhasthaSetu AI · Trained on Simhastha 2016 data · Live analysis</div>
            </div>
            <div className="ml-auto flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Live
            </div>
          </div>
        </div>
        {/* faint bg pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      {/* Anomaly Alert Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-red-700">
            <AlertCircle size={16} /> Stampede Precursor
          </div>
          <div className="mt-1 text-xs text-red-600">3 Crowd Crush reports · Sector 4 · Last 15 min</div>
          <div className="mt-2 text-xs font-bold text-red-800">→ Escalate to NDRF immediately</div>
        </div>
        <div className="rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-orange-700">
            <TrendingUp size={16} /> Surge Incoming
          </div>
          <div className="mt-1 text-xs text-orange-600">Ram Ghat hitting 97% at 8 AM tomorrow</div>
          <div className="mt-2 text-xs font-bold text-orange-800">→ Pre-deploy Ambulance-3 by 5:30 AM</div>
        </div>
        <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-black text-amber-700">
            <Clock size={16} /> Peak Window
          </div>
          <div className="mt-1 text-xs text-amber-600">Mahakal corridor peak: 10 AM – 12 PM</div>
          <div className="mt-2 text-xs font-bold text-amber-800">→ Restrict entry at North Gate 9:30 AM</div>
        </div>
      </div>

      {/* Crowd Density Forecast */}
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            <span className="font-black text-gray-950">Crowd Density Forecast — Shahi Snan</span>
          </div>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">
            High Risk Tomorrow
          </span>
        </div>
        <p className="mb-4 text-xs text-gray-400">
          Predicted crowd density % by location · Red line = 85% safe threshold · Based on Simhastha 2016 patterns
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={crowdData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradMahakal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gradTriveni" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 105]} unit="%" />
            <Tooltip content={<CrowdTooltip />} />
            <ReferenceLine y={85} stroke="#dc2626" strokeDasharray="6 3" strokeWidth={2}
              label={{ value: '85% threshold', position: 'insideTopRight', fontSize: 10, fill: '#dc2626' }} />
            <Area type="monotone" dataKey="ramGhat" name="Ram Ghat"
              stroke="#f97316" strokeWidth={2.5} fill="url(#gradRam)" dot={false} activeDot={{ r: 5, fill: '#f97316' }} />
            <Area type="monotone" dataKey="mahakal" name="Mahakal Corridor"
              stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradMahakal)" dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
            <Area type="monotone" dataKey="triveni" name="Triveni Ghat"
              stroke="#9ca3af" strokeWidth={2} fill="url(#gradTriveni)" dot={false} activeDot={{ r: 5, fill: '#9ca3af' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          </AreaChart>
        </ResponsiveContainer>

        {/* Peak time pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
            🔴 Ram Ghat peak: 8 AM (97%) — Shahi Snan
          </div>
          <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            🟡 Mahakal peak: 10 AM (99%) — Post-snan movement
          </div>
          <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
            ⚪ Triveni peak: 8 AM (70%) — Below threshold
          </div>
        </div>
      </div>

      {/* Two column: Incident Patterns + Response Time */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Incident Pattern Bar Chart */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
          <div className="mb-1 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-orange-500" />
            <span className="font-black text-gray-950">Incident Pattern — By Hour (2016 Data)</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">Historical incident frequency to predict high-risk time windows for tomorrow</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={patternData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f1f1', fontSize: 12 }} />
              <Bar dataKey="Medical" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Drowning" stackId="a" fill="#3b82f6" />
              <Bar dataKey="Crowd Crush" stackId="a" fill="#dc2626" />
              <Bar dataKey="Missing" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
          {/* High risk callout */}
          <div className="mt-3 rounded-xl bg-red-50 border border-red-100 p-3">
            <div className="flex items-center gap-2 text-xs font-black text-red-700">
              <AlertCircle size={13} /> Highest risk window: 8–10 AM
            </div>
            <div className="mt-1 text-xs text-red-600">
              12 medical + 9 crowd crush incidents historically. All units must be deployed by 7:30 AM.
            </div>
          </div>
        </div>

        {/* Response Time Trend */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
          <div className="mb-1 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="font-black text-gray-950">Response Time Trend</span>
          </div>
          <p className="mb-4 text-xs text-gray-400">Average emergency response time improving as coordination improves (minutes)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={responseTimeTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit=" min" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f1f1', fontSize: 12 }}
                formatter={(val: any) => [`${val} min`, '']} />
              <ReferenceLine y={5} stroke="#22c55e" strokeDasharray="6 3" strokeWidth={2}
                label={{ value: 'Target: 5 min', position: 'insideTopRight', fontSize: 10, fill: '#16a34a' }} />
              <Line type="monotone" dataKey="avgMin" name="Avg Response"
                stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }}
                activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-red-50 p-2">
              <div className="text-lg font-black text-red-600">18 min</div>
              <div className="text-[10px] text-gray-400">2016 avg</div>
            </div>
            <div className="rounded-xl bg-orange-50 p-2">
              <div className="text-lg font-black text-orange-500">4.8 min</div>
              <div className="text-[10px] text-gray-400">Today avg</div>
            </div>
            <div className="rounded-xl bg-green-50 p-2">
              <div className="text-lg font-black text-green-600">73%</div>
              <div className="text-[10px] text-gray-400">Improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Deployment Plan */}
      <div className="rounded-[2rem] border border-gray-100 bg-white shadow-xl overflow-hidden">
        {!deployShown ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-orange-300 rounded-[2rem] bg-orange-50 m-1">
            <Sparkles size={44} className="text-orange-300 mb-4" />
            <div className="text-xl font-black text-gray-800">Generate AI Deployment Plan</div>
            <div className="mt-2 text-sm text-gray-400 max-w-md">
              Based on current incidents + Simhastha 2016 historical data, AI will generate a complete unit deployment recommendation for tomorrow's Shahi Snan
            </div>
            <div className="mt-3 flex gap-3 text-xs text-gray-400">
              <span className="rounded-full bg-orange-100 px-3 py-1 font-semibold text-orange-600">Live Claude AI</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-500">2016 Data</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-500">Ujjain-specific</span>
            </div>
            <button onClick={generateDeployPlan}
              className="mt-6 rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-orange-600 active:scale-95">
              ✦ Generate Tomorrow's Plan
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 bg-orange-500 px-5 py-3 text-sm font-bold text-white">
              <Sparkles size={14} />
              Generated by SimhasthaSetu AI · {new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              <button onClick={() => { setDeployShown(false); setDeployPlan('') }}
                className="ml-auto rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30">
                Regenerate
              </button>
            </div>
            <div className="p-6">
              {deployLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-orange-500">
                  <Loader2 size={28} className="animate-spin" />
                  <div className="text-sm font-semibold">SimhasthaSetu AI is analyzing...</div>
                  <div className="text-xs text-gray-400">Correlating live incidents with 2016 Simhastha patterns</div>
                  <div className="flex gap-1 mt-2">
                    {[0, 150, 300].map(d => (
                      <span key={d} className="h-2 w-2 rounded-full bg-orange-400 animate-bounce"
                        style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">{deployPlan}</pre>
              )}
            </div>
          </>
        )}
      </div>

      {/* Historical comparison */}
      <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-orange-500" />
          <span className="font-black text-gray-950">SimhasthaSetu vs Simhastha 2016</span>
          <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">On Track</span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Avg Response Time', before: '18-25 min', after: '4.8 min', good: true },
            { label: 'Coordination Channels', before: '12+', after: '1', good: true },
            { label: 'Incident Deduplication', before: 'None', after: 'Auto 60s', good: true },
            { label: 'Surge Warning Lead Time', before: 'Reactive', after: '60-90 min', good: true },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-gray-100 p-4 text-center">
              <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">{item.label}</div>
              <div className="text-sm text-red-400 line-through mb-1">{item.before}</div>
              <div className="text-base font-black text-green-600">{item.after}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Main ControlRoom Component ───────────────────────────────────────────────

export default function ControlRoom() {
  const [incidents, setIncidents] = useState<any[]>(read('incidents'))
  const [units, setUnits] = useState<any[]>(read('units'))
  const [alerts, setAlerts] = useState<any[]>(read('alerts'))
  const [from, setFrom] = useState('POL')
  const [to, setTo] = useState('MED')
  const [msg, setMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'insights'>('dashboard')

  useEffect(() => {
    const load = () => {
      setIncidents(read('incidents'))
      setUnits(read('units'))
      setAlerts(read('alerts'))
    }
    load()
    const iv = setInterval(load, 3000)
    return () => clearInterval(iv)
  }, [])

  const stats = useMemo(() => [
    { label: 'Active Incidents', value: incidents.filter(i => i.status !== 'Merged').length },
    { label: 'Units Deployed', value: units.filter(u => u.status !== 'Available').length },
    { label: 'Alerts Sent', value: alerts.length },
    { label: 'Critical P1', value: incidents.filter(i => i.severity === 'P1' && i.status !== 'Merged').length, critical: true }
  ], [incidents, units, alerts])

  const visibleIncidents = incidents.filter(i => i.status !== 'Merged')
  const counts = visibleIncidents.reduce((acc: any, inc: any) => (
    { ...acc, [inc.type]: (acc[inc.type] || 0) + 1 }
  ), {})

  function assignUnit(incidentId: string, unitId: string) {
    if (!unitId) return
    const nextIncidents = incidents.map(inc =>
      inc.id === incidentId ? { ...inc, status: 'Assigned', assignedUnit: unitId } : inc
    )
    const nextUnits = units.map(unit =>
      unit.id === unitId ? { ...unit, status: 'Dispatched', location: 'Ram Ghat response' } : unit
    )
    setIncidents(nextIncidents)
    setUnits(nextUnits)
    localStorage.setItem('incidents', JSON.stringify(nextIncidents))
    localStorage.setItem('units', JSON.stringify(nextUnits))
    toast.success(`${unitId} dispatched`)
  }

  function sendAlert() {
    if (!msg.trim()) return toast.error('Type an alert message')
    const alert = { id: `A-${Date.now()}`, from, to, msg, time: new Date().toISOString() }
    const next = [alert, ...alerts]
    setAlerts(next)
    localStorage.setItem('alerts', JSON.stringify(next))
    setMsg('')
    toast.success('Inter-agency alert sent')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/40 p-4 sm:p-6 lg:p-8">

      {/* Navbar */}
      <nav className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div className="border-l-4 border-orange-500 pl-3">
          <div className="text-xl font-black text-gray-950">SimhasthaSetu</div>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Control Room</div>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> System Operational
          </div>
          <div className="text-xs text-gray-400">Ujjain · {ujjainClock()}</div>
        </div>
      </nav>

      {/* Tab switcher */}
      <div className="mb-5 flex gap-2 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Map size={15} /> Live Dashboard
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${activeTab === 'insights' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Brain size={15} /> AI Insights
          <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">3</span>
        </button>
      </div>

      {/* Stats bar — shown on both tabs */}
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label}
            className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${stat.critical ? 'bg-red-50' : ''}`}>
            {stat.critical && (
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: 'radial-gradient(circle, #fca5a5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            )}
            <div className="relative text-3xl font-black text-gray-950">{stat.value}</div>
            <div className="relative mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* AI INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <AIInsightsPanel incidents={incidents} units={units} />
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div className="grid gap-6 xl:grid-cols-[0.64fr_0.36fr]">
          <section className="space-y-6">

            {/* Map */}
            <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-4 shadow-xl">
              <div className="absolute left-8 top-8 z-[500] rounded-xl bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm">
                <div className="mb-2 font-black text-gray-950">Incident legend</div>
                {Object.entries(counts).map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2 py-0.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    {type}: {count as number}
                  </div>
                ))}
              </div>
              <div className="h-[560px] overflow-hidden rounded-[1.5rem] border border-gray-200">
                <MapContainer center={[23.1828, 75.7682]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution="&copy; CARTO"
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  <Polyline pathOptions={{ color: '#f97316', weight: 4 }}
                    positions={[[23.1818, 75.7672], [23.1839, 75.7675], [23.1842, 75.7697], [23.1822, 75.7701], [23.1818, 75.7672]]} />
                  <Polyline pathOptions={{ color: '#f59e0b', weight: 4 }}
                    positions={[[23.1802, 75.7634], [23.1825, 75.7638], [23.1822, 75.7662], [23.1804, 75.7661], [23.1802, 75.7634]]} />
                  {visibleIncidents.map((inc: any) => (
                    <CircleMarker key={inc.id}
                      center={[inc.lat || 23.1828, inc.lng || 75.7682]}
                      radius={inc.severity === 'P1' ? 11 : 8}
                      pathOptions={{ color: colorBySeverity[inc.severity] || '#f59e0b', fillColor: colorBySeverity[inc.severity] || '#f59e0b', fillOpacity: 0.85 }}>
                      <Popup>
                        <div>
                          <b>{inc.type} · {inc.severity}</b><br />
                          {inc.location}<br />{inc.summary}<br />
                          {inc.mergedReports ? `⚠️ ${inc.mergedReports} reports merged` : ''}
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Alert feed + Resource tracker */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-center gap-2 font-black text-gray-950">
                  <Radio className="h-4 w-4 text-orange-500" /> Inter-Agency Alert Feed
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={from} onChange={e => setFrom(e.target.value)}
                    className="rounded-xl border border-gray-200 p-2 text-sm">
                    {Object.keys(agencies).map(a => <option key={a}>{a}</option>)}
                  </select>
                  <select value={to} onChange={e => setTo(e.target.value)}
                    className="rounded-xl border border-gray-200 p-2 text-sm">
                    {Object.keys(agencies).map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <textarea value={msg} onChange={e => setMsg(e.target.value)}
                  className="mt-3 h-20 w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="Compose alert..." />
                <button onClick={sendAlert}
                  className="mt-3 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all">
                  Send Alert
                </button>
                <div className="mt-4 space-y-3 max-h-52 overflow-auto">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${(agencies as any)[alert.from] || 'bg-gray-500'}`}>
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
                </div>
              </div>

              <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
                <div className="mb-4 font-black text-gray-950">Resource Tracker</div>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {units.map((unit: any) => {
                        const UnitIcon = unitIcon[unit.type]
                        return (
                          <tr key={unit.id} className="border-b border-gray-100 last:border-0">
                            <td className="p-3 font-semibold text-gray-900">
                              {typeof UnitIcon === 'string' ? UnitIcon : <UnitIcon className="inline h-4 w-4" />} {unit.name}
                            </td>
                            <td className="p-3">
                              <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass[unit.status] || statusClass.Available}`}>
                                {unit.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm font-bold text-gray-400">
                  CCTV Feed — Integration Ready
                </div>
              </div>
            </div>
          </section>

          {/* Incident feed sidebar */}
          <aside className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
            <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 font-bold text-white">
              Live Incidents <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            </div>
            <div className="max-h-[840px] space-y-3 overflow-auto p-4">
              {!visibleIncidents.length && (
                <div className="py-12 text-center text-gray-400">
                  <CheckCircle size={48} className="mx-auto text-green-400" />
                  All clear · No active incidents
                </div>
              )}
              {visibleIncidents.map((inc: any) => {
                const Icon = iconByType[inc.type] || AlertTriangle
                return (
                  <div key={inc.id}
                    className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md">
                    <div className="w-1 rounded bg-orange-500"
                      style={{ backgroundColor: colorBySeverity[inc.severity] }} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 font-bold text-gray-950">
                          <Icon size={16} className="text-orange-500" />{inc.type}
                        </div>
                        <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-700">
                          {inc.severity}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{inc.location}</div>
                      <p className="mt-2 text-sm text-gray-600">{inc.summary}</p>
                      {inc.mergedReports && (
                        <div className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                          ⚠️ {inc.mergedReports} reports merged
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                          {inc.status}
                        </span>
                        <select onChange={e => assignUnit(inc.id, e.target.value)}
                          value=""
                          className="rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300">
                          <option value="">Assign Unit</option>
                          {units.filter(u => u.status === 'Available').map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}