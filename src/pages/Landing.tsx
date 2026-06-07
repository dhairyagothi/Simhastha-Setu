import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { ArrowRight, Clock, Link2, MapPin, Mic, Monitor, PhoneCall, Shield, User, Users, Zap } from 'lucide-react'

const roles = [
  { role: 'pilgrim', path: '/pilgrim', title: 'Pilgrim', subtitle: 'Mobile emergency reporting', Icon: User, color: 'text-orange-500' },
  { role: 'control', path: '/control', title: 'Control Room', subtitle: 'Live command dashboard', Icon: Monitor, color: 'text-red-500' },
  { role: 'agency', path: '/control', title: 'Agency', subtitle: 'Police · Medical · Fire · NDRF', Icon: Shield, color: 'text-amber-500' }
]

export default function Landing(){
  const navigate = useNavigate()
  const setRole = useStore(s => s.setRole)

  function loginAs(role: string, path: string){
    localStorage.setItem('role', role)
    setRole(role)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-white">
      <section
        className="relative flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat text-center"
        style={{ backgroundImage: `url(${IMAGES.hero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-orange-900/30 to-white" />
        <div className="relative mx-auto max-w-4xl px-4 text-white">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/30 bg-white/15 text-4xl font-black shadow-2xl backdrop-blur-sm">SS</div>
          <h1 className="text-6xl font-black tracking-tight sm:text-7xl">SimhasthaSetu</h1>
          <p className="mt-5 text-xl font-medium text-orange-50 sm:text-2xl">Har Pal Ek Setu · हर पल एक सेतु</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80">A real-time bridge for pilgrims, agencies, and control-room teams during Simhastha 2028 in Ujjain.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Choose portal</div>
          <h2 className="mt-3 text-3xl font-black text-gray-950">Three roles, one live operating picture</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {roles.map(({ role, path, title, subtitle, Icon, color }) => (
            <button key={role} onClick={() => loginAs(role, path)} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-tr-2xl bg-[radial-gradient(circle,rgba(249,115,22,0.85),transparent_65%)] opacity-10" />
              <Icon size={32} className={color} />
              <div className="mt-8 text-xl font-black text-gray-950">{title}</div>
              <div className="mt-2 text-sm text-gray-500">{subtitle}</div>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-orange-500">Enter portal <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></div>
            </button>
          ))}
        </div>
      </section>


      <section className="bg-gradient-to-b from-white to-orange-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="rounded-[2rem] bg-gray-950 p-6 text-white shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-black uppercase tracking-[0.3em] text-orange-200">
              <PhoneCall className="h-4 w-4" /> Unique demo feature
            </div>
            <div className="mt-6 text-6xl font-black text-orange-400">1916</div>
            <h3 className="mt-3 text-3xl font-black">Single call to dispatch</h3>
            <p className="mt-4 text-sm leading-7 text-gray-300">
              A pilgrim with any phone can dial the mela helpline, speak in Hindi, Gujarati, Marathi, Bengali, or English, and SimhasthaSetu turns the call into a mapped P1 ticket, ambulance assignment, and SMS callback in under 90 seconds.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-3"><Mic className="h-5 w-5 text-orange-300" /><div className="mt-2 text-xs font-bold">Voice first</div></div>
              <div className="rounded-2xl bg-white/10 p-3"><MapPin className="h-5 w-5 text-orange-300" /><div className="mt-2 text-xs font-bold">Auto map plot</div></div>
              <div className="rounded-2xl bg-white/10 p-3"><Clock className="h-5 w-5 text-orange-300" /><div className="mt-2 text-xs font-bold">90 sec dispatch</div></div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-lg">
              <Link2 className="h-7 w-7 text-orange-500" />
              <h4 className="mt-4 font-black text-gray-950">Cross-agency single truth</h4>
              <p className="mt-2 text-sm leading-6 text-gray-600">Police, medical, NDRF, fire, and mela administration see one shared incident and resource state instead of scattered radio and WhatsApp threads.</p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-lg">
              <MapPin className="h-7 w-7 text-orange-500" />
              <h4 className="mt-4 font-black text-gray-950">Ujjain-specific intelligence</h4>
              <p className="mt-2 text-sm leading-6 text-gray-600">Ram Ghat choke points, Mahakal corridor peaks, pre-dawn drowning risk, and noon heat-exhaustion patterns are baked into the demo logic.</p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-lg">
              <Users className="h-7 w-7 text-orange-500" />
              <h4 className="mt-4 font-black text-gray-950">Deduplication at scale</h4>
              <p className="mt-2 text-sm leading-6 text-gray-600">Many reports for one emergency become one actionable merged incident with a visible report-count badge.</p>
            </div>
            <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-lg">
              <Zap className="h-7 w-7 text-orange-500" />
              <h4 className="mt-4 font-black text-gray-950">Predictive, not reactive</h4>
              <p className="mt-2 text-sm leading-6 text-gray-600">The AI insights page turns historical Simhastha 2016 patterns and live incidents into deployment recommendations before density becomes dangerous.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-orange-100 bg-orange-50/60 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 text-sm font-semibold text-gray-700">
          <SmartImage src={IMAGES.mahakal} alt="Mahakal temple" fallbackTitle="Mahakal" className="h-12 w-12 rounded-full border-2 border-orange-200 object-cover" />
          <span>Powered by Simhastha 2028 · Ujjain, Madhya Pradesh</span>
        </div>
      </footer>
    </div>
  )
}
