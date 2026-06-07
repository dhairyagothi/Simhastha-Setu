import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { generatePAAnnouncement } from '../utils/claude'
import { Camera, Search, User, Volume2 } from 'lucide-react'

function Thinking(){ return <div className="flex items-center justify-center gap-2 py-3 text-sm text-orange-500"><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:150ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-orange-400 [animation-delay:300ms]" />SimhasthaSetu AI is analyzing...</div> }

export default function Missing(){
  const [cases, setCases] = useState<any[]>(JSON.parse(localStorage.getItem('missing')||'[]'))
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [lastSeen, setLastSeen] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('')
  const [activeAnnouncement, setActiveAnnouncement] = useState<any>(null)
  const [loadingId, setLoadingId] = useState('')

  function save(next:any[]){ setCases(next); localStorage.setItem('missing', JSON.stringify(next)) }
  function handlePhoto(file?: File){
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }
  function submit(e: React.FormEvent){
    e.preventDefault()
    if(!name || !age || !lastSeen) return toast.error('Name, age, and last seen are required')
    const c = { id:`SS-MP-${Math.floor(1000 + Math.random()*9000)}`, name, age, lastSeen, description, photo, matched:false, status:'Searching' }
    save([c, ...cases]); setName(''); setAge(''); setLastSeen(''); setDescription(''); setPhoto('')
    toast.success('Missing person case saved')
  }
  async function makeAnnouncement(c:any){
    setLoadingId(c.id)
    const text = await generatePAAnnouncement(c)
    setActiveAnnouncement({ caseId:c.id, text, en:`Announcement for ${c.name}, age ${c.age}, last seen at ${c.lastSeen}.` })
    setLoadingId('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.45fr_0.55fr]">
        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
          <div className="mb-4 rounded-xl bg-orange-500 p-4 text-white"><Search size={24} className="text-white" /><div className="mt-2 font-black">Upload a clear face photo for AI matching</div><div className="text-sm text-white/80">Works best with front-facing recent photos.</div></div>
          <form onSubmit={submit} className="space-y-4">
            <label className="flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 text-center">
              {photo ? <img src={photo} alt="Uploaded preview" className="h-full w-full object-cover" /> : <div><Camera size={32} className="mx-auto text-orange-300" /><div className="mt-2 font-bold text-orange-400">Tap to upload photo</div></div>}
              <input type="file" accept="image/*" className="hidden" onChange={e=>handlePhoto(e.target.files?.[0])} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2"><input value={name} onChange={e=>setName(e.target.value)} className="rounded-xl border border-gray-200 p-3" placeholder="Name" /><input value={age} onChange={e=>setAge(e.target.value)} className="rounded-xl border border-gray-200 p-3" placeholder="Age" /></div>
            <input value={lastSeen} onChange={e=>setLastSeen(e.target.value)} className="w-full rounded-xl border border-gray-200 p-3" placeholder="Last seen location" />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} className="h-24 w-full rounded-xl border border-gray-200 p-3" placeholder="Clothing or description" />
            <button className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white shadow-lg shadow-orange-200">Submit Missing Person</button>
          </form>

          {activeAnnouncement && <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4"><div className="flex items-center gap-2 font-black text-gray-950"><Volume2 className="text-orange-500" /> PA System Broadcast Ready</div><div className="mt-3 text-lg leading-8 text-gray-900">{activeAnnouncement.text}</div><div className="mt-2 text-sm italic text-gray-500">{activeAnnouncement.en}</div><button onClick={() => toast.success('Broadcast sent to 4 PA zones near Ram Ghat')} className="mt-4 w-full rounded-xl bg-orange-500 py-3 font-bold text-white">Broadcast to 4 PA zones near Ram Ghat</button></div>}
        </section>

        <section className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between"><div><div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Active Cases Feed</div><h1 className="mt-1 text-3xl font-black text-gray-950">Missing Person Module</h1></div><div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{cases.length} cases</div></div>
          <div className="space-y-4">{cases.map(c => <div key={c.id} className={`relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm ${c.matched ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}>
            <div className="flex gap-4"><div className="shrink-0">{c.photo ? <img src={c.photo} alt={c.name} className="h-16 w-16 rounded-xl border-2 border-gray-200 object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100"><User className="text-gray-400" /></div>}{c.matched && <div className="mt-2 h-1 rounded-full bg-gray-100"><div className="h-1 rounded-full bg-green-500" style={{width:`${c.confidence || 87}%`}} /></div>}</div><div className="min-w-0 flex-1"><div className="font-black text-gray-950">{c.name}, {c.age}</div><div className="mt-1 text-sm text-gray-500">Last seen: {c.lastSeen}</div><div className="mt-1 font-mono text-xs text-gray-400">{c.id}</div>{c.matched && <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">AI Match Found · {c.confidence || 87}%</div>}</div><div className="shrink-0">{c.status === 'Resolved' ? <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">Resolved</span> : c.matched ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">✓ Match Found · {c.confidence || 87}%</span> : <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">Searching...</span>}</div></div>
            <button onClick={() => makeAnnouncement(c)} className="mt-4 w-full rounded-xl border border-orange-200 bg-orange-50 py-2 text-sm font-bold text-orange-700">Generate Announcement</button>
            {loadingId === c.id && <Thinking />}
          </div>)}</div>
        </section>
      </div>
    </div>
  )
}
