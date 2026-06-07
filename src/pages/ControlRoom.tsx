import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import toast from 'react-hot-toast'
import { AlertTriangle, Car, CheckCircle, Flame, Heart, Radio, Shield, UserX, Users } from 'lucide-react'

const agencies = { POL:'bg-blue-500', MED:'bg-green-500', FIRE:'bg-red-500', NDRF:'bg-purple-500', MELA:'bg-orange-500' }
const iconByType:any = { Medical: Heart, Fire: Flame, Missing: UserX, 'Crowd Crush': Users, Security: Shield, Drowning: Users }
const colorBySeverity:any = { P1: '#dc2626', P2: '#f97316', P3: '#f59e0b' }
const unitIcon:any = { Ambulance: '🚑', Fire: '🚒', Police: Car, NDRF: Users }
const statusClass:any = { Available:'bg-green-100 text-green-700', Dispatched:'bg-orange-100 text-orange-700', 'On Scene':'bg-red-100 text-red-700', Returning:'bg-gray-100 text-gray-600' }

function read(key:string){ return JSON.parse(localStorage.getItem(key)||'[]') }
function ujjainClock(){ return new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', hour12:false, day:'2-digit', month:'short', year:'numeric' }).replace(',', ' IST ·') }

export default function ControlRoom(){
  const [incidents, setIncidents] = useState<any[]>(read('incidents'))
  const [units, setUnits] = useState<any[]>(read('units'))
  const [alerts, setAlerts] = useState<any[]>(read('alerts'))
  const [from, setFrom] = useState('POL')
  const [to, setTo] = useState('MED')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    const load = () => { setIncidents(read('incidents')); setUnits(read('units')); setAlerts(read('alerts')) }
    load()
    const iv = setInterval(load,3000)
    return ()=>clearInterval(iv)
  },[])

  const stats = useMemo(() => [
    { label:'Active Incidents', value:incidents.filter(i=>i.status !== 'Merged').length },
    { label:'Units Deployed', value:units.filter(u=>u.status !== 'Available').length },
    { label:'Alerts Sent', value:alerts.length },
    { label:'Critical P1', value:incidents.filter(i=>i.severity === 'P1' && i.status !== 'Merged').length, critical:true }
  ], [incidents, units, alerts])

  const visibleIncidents = incidents.filter(i => i.status !== 'Merged')
  const counts = visibleIncidents.reduce((acc:any, inc:any) => ({...acc, [inc.type]:(acc[inc.type]||0)+1}), {})

  function assignUnit(incidentId:string, unitId:string){
    if(!unitId) return
    const nextIncidents = incidents.map(inc => inc.id === incidentId ? {...inc, status:'Assigned', assignedUnit: unitId} : inc)
    const nextUnits = units.map(unit => unit.id === unitId ? {...unit, status:'Dispatched', location:'Ram Ghat response'} : unit)
    setIncidents(nextIncidents); setUnits(nextUnits)
    localStorage.setItem('incidents', JSON.stringify(nextIncidents)); localStorage.setItem('units', JSON.stringify(nextUnits))
    toast.success(`${unitId} dispatched`)
  }

  function sendAlert(){
    if(!msg.trim()) return toast.error('Type an alert message')
    const alert = { id:`A-${Date.now()}`, from, to, msg, time:new Date().toISOString() }
    const next = [alert, ...alerts]
    setAlerts(next); localStorage.setItem('alerts', JSON.stringify(next)); setMsg('')
    toast.success('Inter-agency alert sent')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50/40 p-4 sm:p-6 lg:p-8">
      <nav className="mb-5 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div className="border-l-4 border-orange-500 pl-3"><div className="text-xl font-black text-gray-950">SimhasthaSetu</div><div className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Control Room</div></div>
        <div className="text-xs text-gray-400">Ujjain · {ujjainClock()}</div>
      </nav>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(stat => <div key={stat.label} className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${stat.critical ? 'bg-red-50' : ''}`}>
          {stat.critical && <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle, #fca5a5 1px, transparent 1px)', backgroundSize:'20px 20px'}} />}
          <div className="relative text-3xl font-black text-gray-950">{stat.value}</div><div className="relative mt-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{stat.label}</div>
        </div>)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.64fr_0.36fr]">
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-4 shadow-xl">
            <div className="absolute left-8 top-8 z-[500] rounded-xl bg-white/90 p-3 text-xs shadow-sm backdrop-blur-sm">
              <div className="mb-2 font-black text-gray-950">Incident legend</div>
              {Object.entries(counts).map(([type,count]) => <div key={type} className="flex items-center gap-2 py-0.5"><span className="h-2 w-2 rounded-full bg-orange-500" />{type}: {count as number}</div>)}
            </div>
            <div className="h-[560px] overflow-hidden rounded-[1.5rem] border border-gray-200">
              <MapContainer center={[23.1828,75.7682]} zoom={14} style={{height:'100%', width:'100%'}}>
                <TileLayer attribution="&copy; CARTO" url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Polyline pathOptions={{color:'#f97316', weight:4}} positions={[[23.1818,75.7672],[23.1839,75.7675],[23.1842,75.7697],[23.1822,75.7701],[23.1818,75.7672]]} />
                <Polyline pathOptions={{color:'#f59e0b', weight:4}} positions={[[23.1802,75.7634],[23.1825,75.7638],[23.1822,75.7662],[23.1804,75.7661],[23.1802,75.7634]]} />
                {visibleIncidents.map((inc:any)=><CircleMarker key={inc.id} center={[inc.lat || 23.1828, inc.lng || 75.7682]} radius={inc.severity === 'P1' ? 11 : 8} pathOptions={{color:colorBySeverity[inc.severity] || '#f59e0b', fillColor:colorBySeverity[inc.severity] || '#f59e0b', fillOpacity:0.85}}><Popup><div><b>{inc.type} · {inc.severity}</b><br />{inc.location}<br />{inc.summary}<br />{inc.mergedReports ? `⚠️ ${inc.mergedReports} reports merged` : ''}</div></Popup></CircleMarker>)}
              </MapContainer>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center gap-2 font-black text-gray-950"><Radio className="h-4 w-4 text-orange-500" /> Inter-Agency Alert Feed</div>
              <div className="grid grid-cols-2 gap-2"><select value={from} onChange={e=>setFrom(e.target.value)} className="rounded-xl border border-gray-200 p-2 text-sm">{Object.keys(agencies).map(a=><option key={a}>{a}</option>)}</select><select value={to} onChange={e=>setTo(e.target.value)} className="rounded-xl border border-gray-200 p-2 text-sm">{Object.keys(agencies).map(a=><option key={a}>{a}</option>)}</select></div>
              <textarea value={msg} onChange={e=>setMsg(e.target.value)} className="mt-3 h-20 w-full rounded-xl border border-gray-200 p-3 text-sm" placeholder="Compose alert..." />
              <button onClick={sendAlert} className="mt-3 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white">Send Alert</button>
              <div className="mt-4 space-y-3">{alerts.map((alert:any)=><div key={alert.id} className="flex gap-3 rounded-2xl bg-gray-50 p-3 text-sm"><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${(agencies as any)[alert.from] || 'bg-gray-500'}`}>{alert.from}</div><div><div className="text-xs font-bold text-orange-600">{alert.from} → {alert.to} · {new Date(alert.time).toLocaleTimeString()}</div><div className="text-gray-600">{alert.msg}</div></div></div>)}</div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-xl">
              <div className="mb-4 font-black text-gray-950">Resource Tracker</div>
              <div className="overflow-hidden rounded-xl border border-gray-100"><table className="w-full text-left text-sm"><tbody>{units.map((unit:any)=>{ const UnitIcon = unitIcon[unit.type]; return <tr key={unit.id} className="border-b border-gray-100 last:border-0"><td className="p-3 font-semibold text-gray-900">{typeof UnitIcon === 'string' ? UnitIcon : <UnitIcon className="inline h-4 w-4" />} {unit.name}</td><td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass[unit.status] || statusClass.Available}`}>{unit.status}</span></td></tr>})}</tbody></table></div>
              <div className="mt-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm font-bold text-gray-400">CCTV Feed — Integration Ready</div>
            </div>
          </div>
        </section>

        <aside className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 font-bold text-white">Live Incidents <span className="h-2 w-2 animate-pulse rounded-full bg-white" /></div>
          <div className="max-h-[840px] space-y-3 overflow-auto p-4">
            {!visibleIncidents.length && <div className="py-12 text-center text-gray-400"><CheckCircle size={48} className="mx-auto text-green-400" />All clear · No active incidents</div>}
            {visibleIncidents.map((inc:any)=>{ const Icon = iconByType[inc.type] || AlertTriangle; return <div key={inc.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"><div className="w-1 rounded bg-orange-500" style={{backgroundColor: colorBySeverity[inc.severity]}} /><div className="flex-1"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2 font-bold text-gray-950"><Icon size={16} className="text-orange-500" />{inc.type}</div><span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-black text-red-700">{inc.severity}</span></div><div className="mt-1 text-xs text-gray-500">{inc.location}</div><p className="mt-2 text-sm text-gray-600">{inc.summary}</p>{inc.mergedReports && <div className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">⚠️ {inc.mergedReports} reports merged</div>}<div className="mt-3 flex items-center justify-between gap-2"><span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">{inc.status}</span><select onChange={e=>assignUnit(inc.id, e.target.value)} value="" className="rounded-xl border border-gray-200 bg-white px-2 py-1 text-xs"><option value="">Assign Unit</option>{units.filter(u=>u.status === 'Available').map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></div></div></div>})}
          </div>
        </aside>
      </div>
    </div>
  )
}
