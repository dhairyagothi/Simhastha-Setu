import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { ArrowRight, Monitor, Shield, User } from 'lucide-react'

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

      <footer className="border-t border-orange-100 bg-orange-50/60 px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 text-sm font-semibold text-gray-700">
          <SmartImage src={IMAGES.mahakal} alt="Mahakal temple" fallbackTitle="Mahakal" className="h-12 w-12 rounded-full border-2 border-orange-200 object-cover" />
          <span>Powered by Simhastha 2028 · Ujjain, Madhya Pradesh</span>
        </div>
      </footer>
    </div>
  )
}
