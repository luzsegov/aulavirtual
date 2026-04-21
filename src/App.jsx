import { useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'

function App() {
  const [page, setPage] = useState('home')

  return page === 'home' ? (
    <Home onLogin={() => setPage('login')} />
  ) : (
    <Login onBack={() => setPage('home')} />
  )
  
}

export default App
