import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/quicksand'
import '@fontsource-variable/nunito'
import './styles/global.css'
import './styles/ui.css'
import { applyTheme } from './theme/applyTheme'
import App from './App.jsx'

applyTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)