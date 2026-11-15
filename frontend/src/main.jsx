import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import {BrowserRouter} from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { MailProvider } from './context/MailContext.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <MailProvider>
        <App />
      </MailProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
