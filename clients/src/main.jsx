import { createRoot } from 'react-dom/client'
import './index.css'
import Apps from './Apps.jsx';
import {BrowserRouter} from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google';
import { DataProvider } from './context/DataContext';
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
    <BrowserRouter>
    <DataProvider>
    <Apps/>
    </DataProvider>
   </BrowserRouter>
  </GoogleOAuthProvider>
)
