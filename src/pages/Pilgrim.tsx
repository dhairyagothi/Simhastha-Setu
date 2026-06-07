import React, { useState } from 'react'
import useStore from '../store/useStore'
import { classifyIncident } from '../utils/claude'
import toast from 'react-hot-toast'
import { IMAGES } from '../data/images'
import SmartImage from '../components/SmartImage'
import { AlertTriangle, Languages, MapPin, Smartphone, Ticket } from 'lucide-react'

export default function Pilgrim(){
  const role = useStore(s=>s.role)
  const [text, setText] = useState('')
  const [type, setType] = useState('Medical')
  const [aiResult, setAiResult] = useState<any>(null)
  const [language, setLanguage] = useState<'hi' | 'en' | 'gu'>('hi')
  const [ticketId, setTicketId] = useState('')

  async function submit(){
    toast.loading('Analyzing...')
    const res = await classifyIncident(text, type)
    toast.dismiss()
    setAiResult(res)

    // generate ticket
    const ticket = `SS-${Date.now()}`
    setTicketId(ticket)
    const incident = {
      id: ticket,
      type: res.type || type,
      severity: res.severity || 'P3',
      summary: res.summary || text,
      location: 'Ram Ghat Sector 4',
      time: new Date().toISOString(),
      status: 'Open'
    }
    const existing = JSON.parse(localStorage.getItem('incidents')||'[]')
    existing.unshift(incident)
    localStorage.setItem('incidents', JSON.stringify(existing))

    toast.success(`Ticket ${ticket} created`)
  }

  return (
    <div className="page-shell">
      <div className="bg-orange-500 px-4 py-2 text-sm font-semibold text-white">SimhasthaSetu · Simhastha 2028 · Ujjain</div>
      <div className="mx-auto grid min-h-[calc(100vh-40px)] max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel overflow-hidden rounded-[2rem]">
          <SmartImage
            src={IMAGES.pilgrim}
            alt="Pilgrim crowd"
            fallbackTitle="Pilgrim Reporter"
            fallbackSubtitle="A mobile-first form stays readable even if the photo fails"
            className="h-56 w-full object-cover"
          />
          <div className="space-y-4 p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              <Smartphone className="h-3.5 w-3.5" /> Mobile reporting
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-950">Pilgrim Incident Reporter</h1>
              <p className="mt-2 text-sm leading-6 text-gray-600">Report medical, missing person, crowd, fire, or security incidents in a few taps. The app queues data and creates a ticket instantly.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 font-semibold text-gray-900"><MapPin className="h-4 w-4 text-orange-500" /> Your location</div>
              <div className="mt-2">Ram Ghat Sector 4</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs font-semibold">
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">2G ready</div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">SMS ticket</div>
              <div className="rounded-2xl bg-white p-3 text-center shadow-sm border border-gray-100">Offline queue</div>
            </div>
            <div className="rounded-2xl bg-orange-50 p-4 text-sm text-gray-700">
              Reminder: keep the report form short so it works well in crowded and low-network conditions.
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Report form</div>
                <h2 className="mt-1 text-2xl font-bold text-gray-950">One tap, one ticket</h2>
              </div>
              <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{role || 'guest'}</div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <select className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200" value={type} onChange={e=>setType(e.target.value)}>
                  <option>Medical</option>
                  <option>Missing</option>
                  <option>Crowd Crush</option>
                  <option>Fire</option>
                  <option>Security</option>
                </select>
                <div className="flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
                  {(['hi','en','gu'] as const).map(lang => (
                    <button key={lang} className={`flex-1 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] ${language===lang ? 'bg-orange-500 text-white' : 'text-gray-500'}`} onClick={() => setLanguage(lang)}>
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <textarea className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200" value={text} onChange={e=>setText(e.target.value)} placeholder="Describe what happened. Example:老人 fainted near Ram Ghat steps" />

              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-[0.99]" onClick={submit}>
                <AlertTriangle className="h-4 w-4" /> Submit Incident
              </button>
            </div>
          </div>

          {ticketId && (
            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500"><Ticket className="h-4 w-4" /> Ticket Registered</div>
              <div className="mt-2 text-3xl font-black text-gray-950">{ticketId}</div>
              <div className="mt-2 text-sm text-gray-500">[SETU] Your ticket {ticketId} is registered</div>
            </div>
          )}

          {aiResult && (
            <div className="glass-panel rounded-[2rem] p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500"><Languages className="h-4 w-4" /> AI Analysis</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gray-600">
                <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">{aiResult.type}</span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{aiResult.severity}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1">{language.toUpperCase()}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{language === 'hi' ? aiResult.hindi : language === 'gu' ? aiResult.multilingual?.gu : aiResult.multilingual?.en}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
