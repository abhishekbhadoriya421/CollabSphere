import React from 'react';
import { Navigate } from 'react-router-dom';
import AppLayout from './AppLayout';
import { useAppSelector } from '../customHooks/reduxCustomHook';
import LoadingPage from '../Loading/LoadingPage';

const ProtectedRoute: React.FC = () => {
    const { status } = useAppSelector((state) => state.LoginReducer);
    if (status === 'authenticated') {
        return <AppLayout />;
    } else if (status === 'unauthenticated') {
        return <Navigate to="/auth/site/login" replace />;
    } else {
        return <LoadingPage />
    }

};

export default ProtectedRoute;