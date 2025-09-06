import { createRoot } from 'react-dom/client'
import Calendar from './Calendar.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.VITE_PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<Calendar />} />
    </Routes>
  </BrowserRouter>
)
