import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from './useAuth'; 

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuthState().data || {};

    //untuk render semua halaman jika sauthenticatednya true, jika tidak kembali ke halaman awal untuk login
    return isAuthenticated ? element : <Navigate to="/" />;
};

export default ProtectedRoute;  