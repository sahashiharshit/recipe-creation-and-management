
import ReactDom from 'react-dom/client'
import './styles/index.css'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';


ReactDom.createRoot(document.getElementById('root')).render(

 
 <BrowserRouter>
 <AdminAuthProvider>
  <App/>
 </AdminAuthProvider>
 </BrowserRouter>
 
)
