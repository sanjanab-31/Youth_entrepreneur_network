import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RoleSelection from './pages/Auth/RoleSelection';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboard Sub-page Imports
import DashboardHome from './pages/Dashboard/shared/DashboardHome';
import MyStartup from './pages/Dashboard/founder/MyStartup';
import FindCoFounder from './pages/Dashboard/founder/FindCoFounder';
import Mentors from './pages/Dashboard/shared/Mentors';
import Incubators from './pages/Dashboard/shared/Incubators';
import Messages from './pages/Dashboard/shared/Messages';
import ActivityFeed from './pages/Dashboard/shared/ActivityFeed';
import Settings from './pages/Dashboard/shared/Settings';
import StartupOverview from './pages/Dashboard/co-founder/StartupOverview';
import TeamCollaboration from './pages/Dashboard/co-founder/TeamCollaboration';

// Mentor Dashboard Sub-page Imports
import MentorDashboard from './pages/Dashboard/mentor/MentorDashboard';
import FounderRequests from './pages/Dashboard/mentor/FounderRequests';
import MyMentees from './pages/Dashboard/mentor/MyMentees';
import Sessions from './pages/Dashboard/mentor/Sessions';
import MentorProfile from './pages/Dashboard/mentor/MentorProfile';
import MentorActivityFeed from './pages/Dashboard/mentor/MentorActivityFeed';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />

            {/* Authentication Routes */}
            <Route path="/auth/role-selection" element={<RoleSelection />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />

            {/* Founder Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['founder']} />}>
                <Route path="/founder" element={<Dashboard role="founder" />}>
                    <Route path="dashboard" element={<DashboardHome role="founder" />} />
                    <Route path="my-startup" element={<MyStartup />} />
                    <Route path="find-co-founder" element={<FindCoFounder />} />
                    <Route path="mentors" element={<Mentors />} />
                    <Route path="incubators" element={<Incubators />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<ActivityFeed />} />
                    <Route path="settings" element={<Settings role="founder" />} />
                </Route>
            </Route>

            {/* Co-Founder Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['co-founder']} />}>
                <Route path="/co-founder" element={<Dashboard role="co-founder" />}>
                    <Route path="dashboard" element={<DashboardHome role="co-founder" />} />
                    <Route path="startup-overview" element={<StartupOverview />} />
                    <Route path="team-collaboration" element={<TeamCollaboration />} />
                    <Route path="mentors" element={<Mentors />} />
                    <Route path="incubators" element={<Incubators />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<ActivityFeed />} />
                    <Route path="settings" element={<Settings role="co-founder" />} />
                </Route>
            </Route>

            {/* Mentor Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
                <Route path="/mentor" element={<Dashboard role="mentor" />}>
                    <Route path="dashboard" element={<MentorDashboard />} />
                    <Route path="founder-requests" element={<FounderRequests />} />
                    <Route path="my-mentees" element={<MyMentees />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="activity-feed" element={<MentorActivityFeed />} />
                    <Route path="profile" element={<MentorProfile />} />
                    <Route path="settings" element={<Settings role="mentor" />} />
                </Route>
            </Route>

            {/* Incubator Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['incubator']} />}>
                <Route path="/incubator" element={<Dashboard role="incubator" />}>
                    <Route path="dashboard" element={<DashboardHome role="incubator" />} />
                    <Route path="incubators" element={<Incubators />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<ActivityFeed />} />
                    <Route path="settings" element={<Settings role="incubator" />} />
                </Route>
            </Route>

            {/* Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<Dashboard role="admin" />}>
                    <Route path="dashboard" element={<DashboardHome role="admin" />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<ActivityFeed />} />
                    <Route path="settings" element={<Settings role="admin" />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
