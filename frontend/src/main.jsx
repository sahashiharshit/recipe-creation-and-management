import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import "./assets/styles/Index.css";
import App from './App'
import { AuthProvider } from './context/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
<React.StrictMode>
<AuthProvider>

<BrowserRouter>
<App />
</BrowserRouter>

</AuthProvider>
</React.StrictMode>

)
