import React from 'react'
import Home from './pages/Home/Home'
import { Outlet } from 'react-router-dom'
import About from './pages/About/About'

const App = () => {
  return (
    <Outlet/>
  )
}

export default App