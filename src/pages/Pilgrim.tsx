import React, { useState } from 'react'
import useStore from '../store/useStore'
import { classifyIncident } from '../utils/claude'
import toast from 'react-hot-toast'
import {
  AlertTriangle,
  CheckCircle,
  Flame,
  Heart,
  Languages,
  MapPin,
  Mic,
  PhoneCall,
  Shield,
  Sparkles,
  Ticket,
  UserX,
  Users,
  Waves
} from 'lucide-react'

const quickTypes = [
  { label: 'Medical', Icon: Heart, color: 'text-red-500' },
  { label: 'Crowd Crush', Icon: Users, color: 'text-orange-500' },
  { label: 'Fire', Icon: Flame, color: 'text-amber-500' },
  { label: 'Missing', Icon: UserX, color: 'text-gray-500' },
  { label: 'Security', Icon: Shield, color: 'text-blue-500' },
  { label: 'Drowning', Icon: Waves, color: 'text-cyan-500' }
]

const callTranscript = 'Meri maa gir gayi, Ram Ghat ke paas, khoon aa raha hai'
const callSteps = [
  'Calling 1916 mela helpline...',
  'IVR connected: Apni samasya bolein.',
  'Listening to pilgrim voice...',
  'Whisper transcript ready.',
  'Claude classified emergency.',
  'Ambulance auto-assigned and SMS sent.'
]

function Thinking(){
  return (
    <div className="flex items-center justify-center gap-2 py-3 text-sm text-orange-500">
      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />
      SimhasthaSetu AI is analyzing...
    </div>
  )
}

function Waveform(){
  return (
    <div className="flex h-16 items-center justify-center gap-1 rounded-2xl bg-gray-950 px-4">
      {Array.from({ length: 22 }).map((_, index) => (
        <span
          key={index}
          className="w-1 animate-pulse rounded-full bg-orange-400"
          style={{
            height: `${14 + ((index * 13) % 34)}px`,
            animationDelay: `${index * 70}ms`
          }}
        />
      ))}
    </div>
  )
}

export default function Pilgrim(){
  const role = useStore(s=>s.role)
  const [text, setText] = useState('')
  const [type, setType] = useState('Medical')
  const [aiResult, setAiResult] = useState<any>(null)
  const [language, setLanguage] = useState<'hi' | 'en' | 'gu'>('hi')
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'form' | 'call'>('form')
  const [callStep, setCallStep] = useState(-1)
  const [callAssignedUnit, setCallAssignedUnit] = useState('')

  function createIncident(result: any, sourceText: string, source: 'Form' | '1916 Call', autoAssign = false){
    const ticket = `SS-${Date.now().toString().slice(-4)}`
    const existingIncidents = JSON.parse(localStorage.getItem('incidents')||'[]')
    const existingUnits = JSON.parse(localStorage.getItem('units')||'[]')
    const availableAmbulance = existingUnits.find((unit:any) => unit.type === 'Ambulance' && unit.status === 'Available')
    const assignedUnit = autoAssign ? availableAmbulance?.id : ''

    const incident = {
      id: ticket,
      type: result.type || type,
      severity: result.severity || 'P3',
      summary: result.summary || sourceText,
      location: 'Ram Ghat Sector 4',
      time: new Date().toISOString(),
      status: assignedUnit ? 'Assigned' : 'Open',
      source,
      assignedUnit,
      lat: 23.1828 + (Math.random() - 0.5) * 0.002,
      lng: 75.7682 + (Math.random() - 0.5) * 0.002
    }

    localStorage.setItem('incidents', JSON.stringify([incident, ...existingIncidents]))

    if(assignedUnit){
      const nextUnits = existingUnits.map((unit:any) => unit.id === assignedUnit ? {
        ...unit,
        status: 'Dispatched',
        location: 'Ram Ghat Sector 4 call response'
      } : unit)
      localStorage.setItem('units', JSON.stringify(nextUnits))
      setCallAssignedUnit(assignedUnit)
    }

    setTicketId(ticket)
    return { ticket, assignedUnit }
  }

  async function submit(){
    if(!text.trim()) return toast.error('Please describe the incident')
    setLoading(true)
    const loadingToast = toast.loading('SimhasthaSetu AI is analyzing...')
    const res = await classifyIncident(text, type)
    toast.dismiss(loadingToast)
    setLoading(false)
    setAiResult(res)
    setCallAssignedUnit('')

    const { ticket } = createIncident(res, text, 'Form')
    toast.success(`Ticket ${ticket} created · SMS confirmation sent`)
  }

  async function simulateCall(){
    if(loading) return
    setMode('call')
    setLoading(true)
    setAiResult(null)
    setTicketId('')
    setCallAssignedUnit('')

    for(let index = 0; index < callSteps.length - 2; index += 1){
      setCallStep(index)
      await new Promise(resolve => setTimeout(resolve, 650))
    }

    setText(callTranscript)
    setCallStep(3)
    const res = await classifyIncident(callTranscript, 'Medical')
    setAiResult(res)
    setCallStep(4)
    await new Promise(resolve => setTimeout(resolve, 450))
    const { ticket, assignedUnit } = createIncident(res, callTranscript, '1916 Call', true)
    setCallStep(5)
    setLoading(false)
    toast.success(`1916 call created ${ticket}${assignedUnit ? ` · ${assignedUnit} dispatched` : ''}`)
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

          <div className="rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-500 to-amber-500 p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-orange-100"><PhoneCall className="h-4 w-4" /> Single call feature</div>
            <div className="mt-3 text-4xl font-black">1916</div>
            <p className="mt-2 text-sm leading-6 text-white/85">Any pilgrim can call the mela helpline, speak in any language, and get an AI-created ticket, map marker, dispatch, and SMS without an app or internet.</p>
            <button onClick={simulateCall} disabled={loading} className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-black text-orange-600 shadow-lg disabled:opacity-70">Demo Call-to-Dispatch</button>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Emergency reporting</div>
                <h1 className="mt-1 text-2xl font-black text-gray-950">One tap or one call</h1>
              </div>
              <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{role || 'guest'}</div>
            </div>

            <div className="mt-5 flex rounded-2xl border border-orange-100 bg-orange-50 p-1 text-sm font-bold">
              <button onClick={() => setMode('form')} className={`flex-1 rounded-xl px-3 py-2 ${mode === 'form' ? 'bg-orange-500 text-white shadow-sm' : 'text-orange-700'}`}>✍️ Form Report</button>
              <button onClick={() => setMode('call')} className={`flex-1 rounded-xl px-3 py-2 ${mode === 'call' ? 'bg-orange-500 text-white shadow-sm' : 'text-orange-700'}`}>📞 Call to Report</button>
            </div>

            {mode === 'form' ? (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {quickTypes.map(({ label, Icon, color }) => <button key={label} onClick={() => setType(label)} className={`rounded-2xl border-2 p-4 text-left transition ${type === label ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-white'}`}><Icon className={color} /><div className="mt-2 text-xs font-bold text-gray-700">{label}</div></button>)}
                </div>

                <textarea className="mt-5 min-h-[150px] w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm shadow-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200" value={text} onChange={e=>setText(e.target.value)} placeholder="Example: Old man collapsed near ghat steps" />
                <button disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-70" onClick={submit}><AlertTriangle className="h-4 w-4" /> Submit Incident</button>
              </>
            ) : (
              <div className="mt-5 rounded-[2rem] border border-gray-100 bg-gray-950 p-5 text-white shadow-inner">
                <div className="mx-auto max-w-xs rounded-[2rem] border border-gray-700 bg-black p-4 shadow-2xl">
                  <div className="text-center text-xs text-gray-400">Calling</div>
                  <div className="mt-1 text-center text-4xl font-black text-white">1916</div>
                  <div className="mt-1 text-center text-sm text-orange-300">Mela Helpline</div>
                  <div className="my-5 flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30"><PhoneCall className="h-7 w-7" /></div></div>
                  <Waveform />
                  <div className="mt-4 rounded-2xl bg-white/10 p-3 text-sm text-gray-200">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-300"><Mic className="h-3.5 w-3.5" /> Transcript</div>
                    {callStep >= 3 ? callTranscript : 'Waiting for caller speech...'}
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {callSteps.map((step, index) => (
                    <div key={step} className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm ${callStep >= index ? 'bg-orange-500/20 text-orange-100' : 'bg-white/5 text-gray-500'}`}>
                      {callStep > index ? <CheckCircle className="h-4 w-4 text-green-400" /> : <span className={`h-4 w-4 rounded-full border ${callStep === index ? 'animate-pulse border-orange-300 bg-orange-400' : 'border-gray-600'}`} />}
                      {step}
                    </div>
                  ))}
                </div>

                <button onClick={simulateCall} disabled={loading} className="mt-5 w-full rounded-2xl bg-orange-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 disabled:opacity-70">Start 1916 Demo Call</button>
              </div>
            )}
            {loading && <Thinking />}
          </div>

          {ticketId && <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-orange-500"><Ticket className="h-4 w-4" /> Ticket confirmation</div><div className="mt-2 font-mono text-2xl font-black text-orange-600">{ticketId}</div><div className="mt-1 text-sm text-orange-700">[SETU] Your ticket {ticketId} is registered. {callAssignedUnit ? `${callAssignedUnit} is being dispatched. Estimated time: 6 min.` : ''}</div></div>}

          {aiResult && <div className="rounded-[2rem] border border-orange-100 bg-white p-5 shadow-xl">
            <div className="flex items-center gap-2 text-sm font-black text-gray-950"><Sparkles className="text-orange-500" size={20} /> ✦ SimhasthaSetu AI Analysis</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.2em]"><span className="rounded-full bg-red-50 px-3 py-1 text-red-700">{aiResult.type}</span><span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">{aiResult.severity}</span>{callAssignedUnit && <span className="rounded-full bg-green-50 px-3 py-1 text-green-700">{callAssignedUnit} dispatched</span>}</div>
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
