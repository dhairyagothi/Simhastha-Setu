import { create } from 'zustand'

type State = {
  role: string | null
  setRole: (r:string|null)=>void
}

const useStore = create<State>((set)=>({
  role: null,
  setRole: (r)=>set({role: r})
}))

export default useStore
