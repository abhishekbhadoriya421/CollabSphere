import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ToastContainer } from "react-toastify";
library.add(fas, fab);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
    <App />
  </StrictMode>,
)
