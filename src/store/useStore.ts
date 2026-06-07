import { create } from 'zustand'

type State = {
  role: string | null
  setRole: (r:string|null)=>void
}
// When police@kumbh.in logs in:
localStorage.setItem('userRole', 'police')

// medical@kumbh.in → 'medical'
// fire@kumbh.in    → 'fire'
// ndrf@kumbh.in    → 'ndrf'
const useStore = create<State>((set)=>({
  role: null,
  setRole: (r)=>set({role: r})
}))

export default useStore
