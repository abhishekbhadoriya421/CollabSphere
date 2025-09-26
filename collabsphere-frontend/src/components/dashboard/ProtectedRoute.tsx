import React from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import { useAppSelector } from '../customHooks/reduxCustomHook';

const ProtectedRoute: React.FC = () => {
    const { accessToken } = useAppSelector((state) => state.LoginReducer);
    if (accessToken) {
        return <AppLayout />;
    }
    return <Navigate to="/auth/site/login" replace />;
};

export default ProtectedRoute;