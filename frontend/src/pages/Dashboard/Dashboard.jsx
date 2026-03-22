
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';

const Dashboard = ({ role }) => {
    return (
        <DashboardLayout role={role}>
            <Outlet />
        </DashboardLayout>
    );
};

export default Dashboard;
