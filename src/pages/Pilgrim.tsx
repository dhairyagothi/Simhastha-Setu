import React, { useState } from 'react'
import useStore from '../store/useStore'
import { classifyIncident } from '../utils/claude'
import toast from 'react-hot-toast'
import { AlertTriangle, Flame, Heart, Languages, MapPin, Shield, Sparkles, Ticket, UserX, Users, Waves } from 'lucide-react'

const quickTypes = [
  { label: 'Medical', Icon: Heart, color: 'text-red-500' },
  { label: 'Crowd Crush', Icon: Users, color: 'text-orange-500' },
  { label: 'Fire', Icon: Flame, color: 'text-amber-500' },
  { label: 'Missing', Icon: UserX, color: 'text-gray-500' },
  { label: 'Security', Icon: Shield, color: 'text-blue-500' },
  { label: 'Drowning', Icon: Waves, color: 'text-cyan-500' }
]

function Thinking(){
  return <div className="flex items-center justify-center gap-2 py-3 text-sm text-orange-500"><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />SimhasthaSetu AI is analyzing...</div>
}

export default function Pilgrim(){
  const role = useStore(s=>s.role)
  const [text, setText] = useState('')
  const [type, setType] = useState('Medical')
  const [aiResult, setAiResult] = useState<any>(null)
  const [language, setLanguage] = useState<'hi' | 'en' | 'gu'>('hi')
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(){
    if(!text.trim()) return toast.error('Please describe the incident')
    setLoading(true)
    const loadingToast = toast.loading('SimhasthaSetu AI is analyzing...')
    const res = await classifyIncident(text, type)
    toast.dismiss(loadingToast)
    setLoading(false)
    setAiResult(res)

    const ticket = `SS-${Date.now().toString().slice(-4)}`
    setTicketId(ticket)
    const incident = {
      id: ticket,
      type: res.type || type,
      severity: res.severity || 'P3',
      summary: res.summary || text,
      location: 'Ram Ghat Sector 4',
      time: new Date().toISOString(),
      status: 'Open',
      lat: 23.1828 + (Math.random() - 0.5) * 0.002,
      lng: 75.7682 + (Math.random() - 0.5) * 0.002
    }
    const existing = JSON.parse(localStorage.getItem('incidents')||'[]')
    localStorage.setItem('incidents', JSON.stringify([incident, ...existing]))
    toast.success(`Ticket ${ticket} created · SMS confirmation sent`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
      <div className="flex items-center justify-between bg-orange-500 px-4 py-3 text-white shadow-sm">
        <div className="font-black tracking-tight">SimhasthaSetu</div>
        <div className="flex items-center gap-2 text-xs font-bold"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-400" />Live</div>
      </div>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Your location</div>
            <div className="mt-2 flex items-center gap-2 font-bold text-gray-950"><MapPin className="h-4 w-4 text-orange-500" /> Ram Ghat Sector 4</div>
            <iframe title="Ram Ghat map" src="https://www.openstreetmap.org/export/embed.html?bbox=75.76,23.18,75.78,23.19&layer=mapnik" className="mt-4 h-32 w-full rounded-xl border border-orange-200" />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-gray-500"><span className="rounded-xl bg-gray-50 p-2">2G ready</span><span className="rounded-xl bg-gray-50 p-2">SMS toast</span><span className="rounded-xl bg-gray-50 p-2">Offline queue</span></div>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div><div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Emergency quick buttons</div><h1 className="mt-1 text-2xl font-black text-gray-950">Report incident</h1></div>
              <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{role || 'guest'}</div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickTypes.map(({ label, Icon, color }) => <button key={label} onClick={() => setType(label)} className={`rounded-2xl border-2 p-4 text-left transition ${type === label ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-white'}`}><Icon className={color} /><div className="mt-2 text-xs font-bold text-gray-700">{label}</div></button>)}
            </div>

            <textarea className="mt-5 min-h-[150px] w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200" value={text} onChange={e=>setText(e.target.value)} placeholder="Example: Old man collapsed near ghat steps" />
            <button disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-70" onClick={submit}><AlertTriangle className="h-4 w-4" /> Submit Incident</button>
            {loading && <Thinking />}
          </div>

          {ticketId && <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-500"><Ticket className="h-4 w-4" /> Ticket confirmation</div><div className="mt-2 font-mono text-2xl font-black text-orange-600">{ticketId}</div><div className="mt-1 text-sm text-orange-700">[SETU] Your ticket {ticketId} is registered.</div></div>}

          {aiResult && <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-black text-gray-950"><Sparkles className="text-orange-500" size={20} /> ✦ SimhasthaSetu AI Analysis</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.2em]"><span className="rounded-full bg-red-50 px-3 py-1 text-red-700">{aiResult.type}</span><span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{aiResult.severity}</span></div>
            <div className="mt-4 flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
              {(['hi','en','gu'] as const).map(lang => <button key={lang} className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${language===lang ? 'bg-orange-500 text-white' : 'text-gray-500'}`} onClick={() => setLanguage(lang)}>{lang === 'hi' ? 'Hindi' : lang === 'en' ? 'English' : 'Gujarati'}</button>)}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500"><Languages className="h-4 w-4" /> Alert text</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">{language === 'hi' ? aiResult.hindi : language === 'gu' ? aiResult.multilingual?.gu : aiResult.multilingual?.en}</p>
          </div>}
        </section>
      </main>
    </div>
  )
}
