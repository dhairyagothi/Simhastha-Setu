import React, { useState } from 'react'
import { Camera, BadgeCheck, SearchCheck } from 'lucide-react'

export default function Missing(){
  const [cases, setCases] = useState<any[]>(JSON.parse(localStorage.getItem('missing')||'[]'))

  function submitDemo(){
    const id = `MP-${Date.now()}`
    const c = {id, name: 'Ram Lal', age: 60, lastSeen: 'Ram Ghat', photo: ''}
    const next = [c,...cases]
    setCases(next)
    localStorage.setItem('missing', JSON.stringify(next))
  }

  return (
    <div className="page-shell p-4 sm:p-6 lg:p-8">
      <div className="glass-panel overflow-hidden rounded-[2rem]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
              <SearchCheck className="h-4 w-4" /> Missing person module
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-950">Find faster, reunite sooner</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">A clean case board for camps and control rooms. One mock AI match is preloaded so the demo feels immediate.</p>
            <div className="mt-6 rounded-[1.5rem] border border-gray-100 bg-gradient-to-br from-orange-500 via-amber-400 to-orange-100 p-6 text-white shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-50">Reminder</div>
              <div className="mt-2 text-2xl font-bold leading-8">Use the case board first, and only show a photo when it adds value.</div>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600" onClick={submitDemo}>
              <Camera className="h-4 w-4" /> Submit Demo Case
            </button>
          </div>
          <div className="border-t border-gray-100 lg:border-l lg:border-t-0 p-6 lg:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Case board</div>
            <div className="mt-4 grid gap-3">
              {cases.map(c=> (
                <div key={c.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-bold text-gray-950">{c.name} · {c.age}</div>
                      <div className="mt-1 text-xs text-gray-500">Last seen: {c.lastSeen}</div>
                    </div>
                    {c.matched ? (
                      <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-green-700">AI Match 87%</div>
                    ) : (
                      <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-500">Pending</div>
                    )}
                  </div>
                  {c.matched && (
                    <div className="mt-3 rounded-2xl bg-orange-50 p-3 text-sm text-orange-800">
                      <div className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-4 w-4" /> AI match found</div>
                      <div className="mt-1">Potential reunification case flagged for camp announcement.</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
