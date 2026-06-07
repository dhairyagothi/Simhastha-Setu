import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Pilgrim from './pages/Pilgrim'
import ControlRoom from './pages/ControlRoom'
import Insights from './pages/Insights'
import Missing from './pages/Missing'

export default function App(){
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#F97316', color: '#fff', borderRadius: '14px' },
          success: { style: { background: '#16A34A', color: '#fff' } },
          error: { style: { background: '#DC2626', color: '#fff' } }
        }}
      />
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/pilgrim' element={<Pilgrim/>} />
        <Route path='/control' element={<ControlRoom/>} />
        <Route path='/insights' element={<Insights/>} />
        <Route path='/missing' element={<Missing/>} />
      </Routes>
    </>
  )
}
