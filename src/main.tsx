import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { applyGlobalPrefs } from './lib/prefs'
import './styles/global.scss'

// Apply persisted preferences (e.g. reduce-motion) before first paint.
applyGlobalPrefs()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
