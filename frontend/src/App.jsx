import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '../@/components/ui/sonner';
import Home from './screens/Home'
import Predictions from './screens/Predictions'

function App() {

  return (
   <div>
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/predictions' element={<Predictions />} />
      </Routes>
   </div>
  )
}

export default App
