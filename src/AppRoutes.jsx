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

// Incubator Dashboard Sub-page Imports
import IncubatorDashboard from './pages/Dashboard/incubator/IncubatorDashboard';
import StartupPipeline from './pages/Dashboard/incubator/StartupPipeline';
import Applications from './pages/Dashboard/incubator/Applications';
import Cohorts from './pages/Dashboard/incubator/Cohorts';
import IncubatorMentors from './pages/Dashboard/incubator/Mentors';
import Analytics from './pages/Dashboard/incubator/Analytics';
import IncubatorProfile from './pages/Dashboard/incubator/IncubatorProfile';
import IncubatorSettings from './pages/Dashboard/incubator/Settings';

// Admin Dashboard Sub-page Imports
import AdminDashboard from './pages/Dashboard/admin/AdminDashboard';
import UserManagement from './pages/Dashboard/admin/UserManagement';
import StartupManagement from './pages/Dashboard/admin/StartupManagement';
import MentorManagement from './pages/Dashboard/admin/MentorManagement';
import IncubatorManagement from './pages/Dashboard/admin/IncubatorManagement';
import ApplicationsControl from './pages/Dashboard/admin/ApplicationsControl';
import ReportsModeration from './pages/Dashboard/admin/ReportsModeration';
import AdminAnalytics from './pages/Dashboard/admin/Analytics';
import ContentManagement from './pages/Dashboard/admin/ContentManagement';
import AdminSettings from './pages/Dashboard/admin/AdminSettings';


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
                    <Route path="dashboard" element={<IncubatorDashboard />} />
                    <Route path="startup-pipeline" element={<StartupPipeline />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="cohorts" element={<Cohorts />} />
                    <Route path="mentors" element={<IncubatorMentors />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="profile" element={<IncubatorProfile />} />
                    <Route path="settings" element={<IncubatorSettings />} />
                </Route>
            </Route>

            {/* Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<Dashboard role="admin" />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="startups" element={<StartupManagement />} />
                    <Route path="mentors" element={<MentorManagement />} />
                    <Route path="incubators" element={<IncubatorManagement />} />
                    <Route path="applications" element={<ApplicationsControl />} />
                    <Route path="reports" element={<ReportsModeration />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="content" element={<ContentManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
