import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { ArrowRight, BellRing, Shield, User, MonitorSmartphone } from 'lucide-react'

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
                <div className="flex h-40 w-full items-end bg-gradient-to-br from-slate-900 via-orange-700 to-amber-500 p-5 text-white">
                  <div className="max-w-[12rem]">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">Command</div>
                    <div className="mt-2 text-lg font-bold leading-6">Live control room dashboard</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-5 text-left">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-950"><MonitorSmartphone className="h-4 w-4 text-orange-500" /> Control Room</div>
                    <div className="text-sm text-gray-500">Live operations dashboard</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-orange-500 transition group-hover:translate-x-1" />
                </div>
              </button>

              <button className="group overflow-hidden rounded-3xl border border-white/70 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl" onClick={() => loginAs('agency', '/control')}>
                <div className="flex h-40 w-full items-end bg-gradient-to-br from-orange-500 via-amber-400 to-orange-100 p-5 text-white">
                  <div className="max-w-[12rem]">
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-50">Agency</div>
                    <div className="mt-2 text-lg font-bold leading-6 text-white">Police · Medical · Fire · NDRF</div>
                  </div>
                </div>
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

            <div className="glass-panel mt-6 rounded-[2rem] p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-950"><BellRing className="h-4 w-4 text-orange-500" /> Reminder Board</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-orange-50 p-4 text-sm text-gray-700">Pilot: keep only one image per section for faster loading.</div>
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">Fallback cards appear if a remote photo is blocked.</div>
                <div className="rounded-2xl bg-amber-50 p-4 text-sm text-gray-700">Use gradients for supporting cards instead of extra photos.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
