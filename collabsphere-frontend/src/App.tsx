import RegistrationPage from "./components/auth/RegistrationPage";
import LoginPage from "./components/auth/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from "react";
import { RefreshPageThunk, GetValidTokenThunk } from "./features/AuthenticationSlice/LoginSlice";
import { useAppDispatch, useAppSelector } from "./components/customHooks/reduxCustomHook";
import OuDashboard from "./components/organization/OuDashboard";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import Dashboard from "./components/dashboard/Dashboad";
import LoadingPage from "./components/Loading/LoadingPage";
function App() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.LoginReducer);
  /**
   * every 5 min access token will be expired so generate new access token
   */
  useEffect(() => {
    if (status === 'checking') {
      dispatch(RefreshPageThunk());
    }
  }, [dispatch, status]);

  useEffect(() => {
    // for page reload 
    const interval = setInterval(() => {
      dispatch(GetValidTokenThunk());
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [dispatch])

  if (status === 'checking' || status === 'loading') {
    return <LoadingPage />
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/site/create" element={<RegistrationPage />} />
          <Route path="/auth/site/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute />} >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="organization/dashboard/index" element={<OuDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
