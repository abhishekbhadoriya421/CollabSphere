import RegistrationPage from "./components/auth/RegistrationPage";
import LoginPage from "./components/auth/LoginPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from "react";
import { RefreshPageThunk } from "./features/AuthenticationSlice/LoginSlice";
import { useAppDispatch } from "./components/customHooks/reduxCustomHook";
import OuDashboard from "./components/organization/OuDashboard";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboad";
function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(RefreshPageThunk());
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/site/create" element={<RegistrationPage />} />
          <Route path="/auth/site/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />} >
            <Route index path="dashboard" element={<Dashboard />} />
            <Route path="organization/dashboard/index" element={<OuDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
