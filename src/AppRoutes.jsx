import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RoleSelection from './pages/Auth/RoleSelection';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />

            {/* Authentication Routes */}
            <Route path="/auth/role-selection" element={<RoleSelection />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            {/* Simulated Protected Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['founder']} />}>
                <Route path="/founder/dashboard" element={<Dashboard role="founder" />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
                <Route path="/mentor/dashboard" element={<Dashboard role="mentor" />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['incubator']} />}>
                <Route path="/incubator/dashboard" element={<Dashboard role="incubator" />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<Dashboard role="admin" />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
