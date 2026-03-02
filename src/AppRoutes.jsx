import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import RoleSelection from './pages/Auth/RoleSelection';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StartupWorkspaceGuard from './components/StartupWorkspaceGuard';

// Dashboard Sub-page Imports
import Messages from './pages/Dashboard/shared/Messages';
import ActivityFeed from './pages/Dashboard/shared/ActivityFeed';
import Sessions from './pages/Dashboard/shared/Sessions';
import Settings from './pages/Dashboard/shared/Settings';
import CoFounderDashboard from './pages/Dashboard/co-founder/CoFounderDashboard';
import StartupOverview from './pages/Dashboard/co-founder/StartupOverview';
import TeamCollaboration from './pages/Dashboard/co-founder/TeamCollaboration';
import Mentors from './pages/Dashboard/shared/Mentors';
import Incubators from './pages/Dashboard/shared/Incubators';
import DashboardHome from './pages/Dashboard/shared/DashboardHome';
import MyStartup from './pages/Dashboard/founder/MyStartup';
import FindCoFounder from './pages/Dashboard/founder/FindCoFounder';
import DiscoverStartups from './pages/Dashboard/co-founder/DiscoverStartups';
import MyApplications from './pages/Dashboard/co-founder/MyApplications';
import JoinRequests from './pages/Dashboard/shared/JoinRequests';

// Mentor Dashboard Sub-page Imports
import MentorDashboard from './pages/Dashboard/mentor/MentorDashboard';
import FounderRequests from './pages/Dashboard/mentor/FounderRequests';
import MyMentees from './pages/Dashboard/mentor/MyMentees';
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
                    <Route index element={<DashboardHome role="founder" />} />
                    <Route path="dashboard" element={<DashboardHome role="founder" />} />
                    <Route path="my-startup" element={<MyStartup />} />
                    <Route path="find-co-founder" element={<FindCoFounder />} />
                    <Route path="co-founder-requests" element={<JoinRequests />} />
                    <Route path="mentors" element={<Mentors />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="incubators" element={<Incubators />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<ActivityFeed />} />
                    <Route path="settings" element={<Settings role="founder" />} />
                </Route>
            </Route>

            {/* Co-Founder Dashboard Routes (Aliased for both variants) */}
            <Route element={<ProtectedRoute allowedRoles={['co-founder', 'cofounder']} />}>
                {['/cofounder', '/co-founder'].map(path => (
                    <Route key={path} path={path} element={<Dashboard role="cofounder" />}>
                        <Route index element={<CoFounderDashboard />} />
                        <Route path="dashboard" element={<CoFounderDashboard />} />
                        <Route path="discover-startups" element={<DiscoverStartups />} />
                        <Route path="find-co-founder" element={<DiscoverStartups />} />
                        <Route path="my-applications" element={<MyApplications />} />
                        <Route path="profile" element={<Settings role="co-founder" />} />
                        <Route path="settings" element={<Settings role="co-founder" />} />

                        {/* Guarded Workspace Routes */}
                        <Route element={<StartupWorkspaceGuard />}>
                            <Route path="my-startup" element={<MyStartup />} />
                            <Route path="mentors" element={<Mentors />} />
                            <Route path="team" element={<TeamCollaboration />} />
                            <Route path="meetings" element={<Sessions />} />
                            <Route path="sessions" element={<Sessions />} />
                            <Route path="messages" element={<Messages />} />
                        </Route>
                    </Route>
                ))}
            </Route>

            {/* Mentor Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
                <Route path="/mentor" element={<Dashboard role="mentor" />}>
                    <Route index element={<MentorDashboard />} />
                    <Route path="dashboard" element={<MentorDashboard />} />
                    <Route path="founder-requests" element={<FounderRequests />} />
                    <Route path="my-mentees" element={<MyMentees />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="activity-feed" element={<MentorActivityFeed />} />
                    <Route path="profile" element={<MentorProfile />} />
                    <Route path="settings" element={<Settings role="mentor" />} />
                </Route>
            </Route>

            {/* Incubator Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['incubator']} />}>
                <Route path="/incubator" element={<Dashboard role="incubator" />}>
                    <Route index element={<IncubatorDashboard />} />
                    <Route path="dashboard" element={<IncubatorDashboard />} />
                    <Route path="startup-pipeline" element={<StartupPipeline />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="cohorts" element={<Cohorts />} />
                    <Route path="mentors" element={<IncubatorMentors />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="profile" element={<IncubatorProfile />} />
                    <Route path="settings" element={<IncubatorSettings />} />
                </Route>
            </Route>

            {/* Admin Dashboard Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<Dashboard role="admin" />}>
                    <Route index element={<AdminDashboard />} />
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

            {/* Catch-all and Redirects */}
            <Route path="/founder/find-cofounder" element={<Navigate to="/founder/find-co-founder" replace />} />
        </Routes>
    );
};

export default AppRoutes;
