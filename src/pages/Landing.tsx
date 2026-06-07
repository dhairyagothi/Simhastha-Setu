import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { ArrowRight, BellRing, Shield, User, MonitorSmartphone , PhoneCall,Clock,MapPin,Mic , Link2 , Users ,  Zap } from 'lucide-react'


export default function Landing(){
  const navigate = useNavigate()
  const setRole = useStore(s => s.setRole)

  function loginAs(role: string, path: string){
    setRole(role)
    navigate(path)
  }

  return (
    <div className="page-shell relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_24%)]" />

      <main className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500 shadow-sm">
              <Shield className="h-4 w-4" /> Simhastha 2028 · Ujjain
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-5xl font-black tracking-tight text-gray-950 sm:text-6xl">
                  Simhastha
                  <span className="block font-light text-gray-600">Setu</span>
                </h1>
                <p className="mt-4 max-w-xl text-lg leading-8 text-gray-600">
                  Har Pal Ek Setu · हर पल एक सेतु. A clean, real-time bridge for pilgrims, agencies, and control-room teams.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Pilgrim</div>
                  <div className="mt-2 text-sm text-gray-600">2G-friendly mobile reporting with AI triage.</div>
                </div>
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Control</div>
                  <div className="mt-2 text-sm text-gray-600">Unified map, alerts, and deployment visibility.</div>
                </div>
                <div className="glass-panel rounded-3xl p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">Agency</div>
                  <div className="mt-2 text-sm text-gray-600">Role-filtered coordination and accountability.</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <button className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl" onClick={() => loginAs('pilgrim', '/pilgrim')}>
                <SmartImage
                  src={IMAGES.pilgrim}
                  alt="Pilgrim crowd"
                  fallbackTitle="Pilgrim View"
                  fallbackSubtitle="Mobile reporting with AI triage"
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between p-5 text-left">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-950"><User className="h-4 w-4 text-orange-500" /> Pilgrim</div>
                    <div className="text-sm text-gray-500">Demo report view</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500 transition group-hover:translate-x-1" />
                </div>
              </button>

              <button className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl" onClick={() => loginAs('control', '/control')}>
              <SmartImage
                  src={IMAGES.command}
                  alt="Command center"
                  fallbackTitle="Command View"
                  fallbackSubtitle="Live control room dashboard"
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between p-5 text-left">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-950"><MonitorSmartphone className="h-4 w-4 text-orange-500" /> Control Room</div>
                    <div className="text-sm text-gray-500">Live operations dashboard</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500 transition group-hover:translate-x-1" />
                </div>
              </button>

              <button className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl" onClick={() => loginAs('agency', '/agency')}>
                <SmartImage
                  src={IMAGES.agency}
                  alt="Agency view"
                  fallbackTitle="Agency View"
                  fallbackSubtitle="Police · Medical · Fire · NDRF"
                  className="h-40 w-full object-cover"
                />
                <div className="flex items-center justify-between p-5 text-left">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-950"><Shield className="h-4 w-4 text-orange-500" /> Agency</div>
                    <div className="text-sm text-gray-500">Police / Medical / Fire / NDRF</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500 transition group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 right-8 hidden h-44 w-44 rounded-full bg-orange-200/60 blur-3xl lg:block" />
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4">
              <SmartImage
                src={IMAGES.hero}
                alt="Ram Ghat Ujjain"
                fallbackTitle="Ujjain Ram Ghat"
                fallbackSubtitle="Hero image unavailable, but the UI remains readable"
                className="h-[560px] w-full rounded-[1.5rem] object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.5rem] bg-gradient-to-t from-orange-950/90 via-orange-900/70 to-transparent p-6 text-white">
                <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-200">Ujjain Ram Ghat</div>
                <div className="mt-2 text-2xl font-bold">Built for the city where medieval streets meet massive crowds.</div>
                <div className="mt-2 max-w-md text-sm text-orange-50/90">One bridge for every agency, every pilgrim, and every live incident.</div>
              </div>
            </div>

           
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
      </main>
    </div>
  )
}
