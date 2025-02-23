import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import About from './pages/About/About.jsx'
import Product from './pages/Product/Product.jsx'
import Home from './pages/Home/Home.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Buy from './pages/Buy/Buy.jsx'
import Signup from './pages/Signup/Signup.jsx'
import Login from './pages/Login/Login.jsx'
import Success from './pages/Success/Success.jsx'
import Failed from './pages/Failed/Failed.jsx'

const router=createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/about',
    element:<About/>
  },
  {
    path:'/product',
    element:<Product/>
  },
  {
    path:'/cart',
    element:<Cart/>
  }
  ,{
    path:'/buy',
    element:<Buy/>
  }
  ,{
    path:'/signup',
    element:<Signup/>
  }
  ,{
    path:'/success',
    element:<Success/>
  }
  ,{
    path:'/failed',
    element:<Failed/>
  }
  ,{
    path:'/login',
    element:<Login/>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
    <RouterProvider router={router}/>
  </StrictMode>,
)
