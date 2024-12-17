import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './authContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import ProjectRouter from './Router.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <ProjectRouter />
    </Router>
  </AuthProvider>
)
