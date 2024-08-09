import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
// Import our custom CSS
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './auth/auth.context.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
        <AuthContextProvider>
          <App />
          </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
