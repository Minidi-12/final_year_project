import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from './lib/store';
import { Provider } from 'react-redux';
import Home from './pages/Home.page.jsx';
import About from './pages/About.page.jsx';
import RequestSupport from './pages/Request.page';
import Login from './pages/Login.page';
import Volunteer from './pages/Volunteer.page';
import GNDashboard from './pages/Gndashboard.page';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about-us" element={<About/>}/>
      <Route path="/request-support" element={<RequestSupport/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/volunteer" element={<Volunteer/>}/>
      <Route path="/verify" element={<GNDashboard/>}/>
    </Routes>
  </BrowserRouter>,
  </StrictMode>,
  </Provider>
)
