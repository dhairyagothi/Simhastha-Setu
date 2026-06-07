import React from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { Sparkles, TrendingUp } from 'lucide-react'

const mock = [
  {time: '6am', ram: 20, mahakal: 15, triveni: 10},
  {time: '8am', ram: 60, mahakal: 50, triveni: 30},
  {time: '10am', ram: 90, mahakal: 70, triveni: 50},
  {time: '12pm', ram: 40, mahakal: 30, triveni: 25},
  {time: '2pm', ram: 30, mahakal: 25, triveni: 20}
]

export default function Insights(){
  return (
    <div className="page-shell p-4 sm:p-6 lg:p-8">
      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              <Sparkles className="h-4 w-4" /> AI Insights
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950">Situational intelligence for Shahi Snan planning</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">Clean charts, a strong visual hierarchy, and the most important AI moments surfaced without clutter.</p>
            <div className="mt-6 rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm">
              <SmartImage
                src={IMAGES.crowd}
                alt="Crowd scale"
                fallbackTitle="Crowd scale"
                fallbackSubtitle="75M+ pilgrims · Simhastha 2016"
                className="h-64 w-full object-cover"
              />
            </div>
          </div>
          <div className="flex h-full min-h-[280px] w-full items-end bg-gradient-to-br from-orange-500 via-amber-400 to-orange-100 p-6 text-white">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-50">Reminder</div>
              <div className="mt-2 max-w-sm text-2xl font-bold leading-8">Keep the insights page focused on trend visibility, not extra imagery.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Crowd surge prediction</div>
              <h2 className="text-xl font-bold text-gray-950">Ram Ghat, Mahakal, Triveni</h2>
            </div>
            <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">85% threshold</div>
          </div>
          <div className="mt-5 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mock}>
                <defs>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.85}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMahakal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="ram" stroke="#F97316" fillOpacity={1} fill="url(#colorRam)" name="Ram Ghat" />
                <Area type="monotone" dataKey="mahakal" stroke="#F59E0B" fillOpacity={1} fill="url(#colorMahakal)" name="Mahakal Mandir" />
                <Area type="monotone" dataKey="triveni" stroke="#6B7280" fillOpacity={0.1} fill="#CBD5E1" name="Triveni Ghat" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-orange-800 shadow-sm">
            Ram Ghat expected to exceed safe capacity at 8:00 AM. Recommend crowd diversion via Route 7-B.
          </div>
        </section>

        <aside className="space-y-6">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500"><TrendingUp className="h-4 w-4" /> Incident pattern recognition</div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { type: 'Medical', count: 6 },
                  { type: 'Missing', count: 2 },
                  { type: 'Fire', count: 1 },
                  { type: 'Crowd', count: 4 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="type" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F97316" radius={[10,10,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">3 Medical incidents in Sector 4 in 15 min — escalation risk.</div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Deployment recommendation</div>
            <div className="mt-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">Deploy 4 extra ambulances near Triveni Ghat between 6–10 AM. Keep NDRF standby near Ram Ghat and reduce Freeganj coverage after 11 AM.</div>
          </div>
        </aside>
      </div>
    </div>
  )
}
