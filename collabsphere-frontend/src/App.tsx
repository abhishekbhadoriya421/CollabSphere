import RegistrationPage from "./components/auth/RegistrationPage";
import LoginPage from "./components/auth/LoginPage";
import Dashboard from './components/dashboard/dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from "react";
import { RefreshPageThunk } from "./features/AuthenticationSlice/LoginSlice";
import { useAppDispatch } from "./components/customHooks/reduxCustomHook";
function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(RefreshPageThunk());
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route index element={<Dashboard />} />
          <Route path="/auth/site/create" element={<RegistrationPage />} />
          <Route path="/auth/site/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
