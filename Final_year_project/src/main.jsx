import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from './lib/store';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
  <BrowserRouter>
    <Routes>
      
        


    </Routes>
  </BrowserRouter>,
  </StrictMode>,
  </Provider>
)
