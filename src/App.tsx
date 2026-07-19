// import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Popup from './popup/popup'

function App() {
  return (
   <div className='p-2 bg-gray-800'>
    <Toaster/>
    <Popup/>
   </div>
  )
}

export default App
