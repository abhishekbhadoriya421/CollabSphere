import LoginPage from "./components/auth/LoginPage";
import Dashboard from './components/dashboard/dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route index element={<Dashboard />} />
          <Route path="/auth/site/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
