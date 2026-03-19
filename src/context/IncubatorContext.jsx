import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    acceptIncubatorApplication,
    assignMentorForIncubatorStartup,
    assignStartupToIncubatorCohort,
    buildIncubatorDerivedState,
    createIncubatorCohort,
    getDefaultIncubatorSettings,
    loadIncubatorState,
    onboardIncubatorMentor,
    onboardIncubatorStartup,
    rejectIncubatorApplication,
    removeMentorForIncubatorStartup,
    removeStartupFromIncubatorCohort
} from '../utils/incubatorService';

const IncubatorContext = createContext();

export const useIncubator = () => useContext(IncubatorContext);

export const IncubatorProvider = ({ children }) => {
    const { user } = useAuth();

    const [pipeline, setPipeline] = useState([]);
    const [applications, setApplications] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [settings, setSettings] = useState(getDefaultIncubatorSettings());
    const [profile, setProfile] = useState(null);
    const [analytics, setAnalytics] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [highPotentialStartups, setHighPotentialStartups] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [nextBatch, setNextBatch] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        setLoading(true);
        const state = await loadIncubatorState(user);

        setPipeline(state.pipeline);
        setApplications(state.applications);
        setCohorts(state.cohorts);
        setMentors(state.mentors);
        setProfile(state.profile);

        const derived = buildIncubatorDerivedState(state.pipeline, state.applications, state.cohorts);
        setAnalytics(derived.analytics);
        setAlerts(derived.alerts);
        setHighPotentialStartups(derived.highPotentialStartups);
        setActivityFeed(derived.activityFeed);
        setNextBatch(derived.nextBatch);

        setLoading(false);
    };

    useEffect(() => {
        refreshData();
        const handler = () => refreshData();
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [user]);

    const acceptApplication = async (appId, cohortId) => {
        await acceptIncubatorApplication(user, appId, cohortId);
        await refreshData();
    };

    const rejectApplication = async (appId) => {
        await rejectIncubatorApplication(appId);
        await refreshData();
    };

    const assignMentorToStartup = async (mentorId, startupId) => {
        await assignMentorForIncubatorStartup(mentorId, startupId);
        await refreshData();
    };

    const removeMentorAssignment = async (mentorId, startupId) => {
        await removeMentorForIncubatorStartup(mentorId, startupId);
        await refreshData();
    };

    const onboardStartup = async (startupData) => {
        const startup = await onboardIncubatorStartup(user, startupData);
        await refreshData();
        return startup;
    };

    const onboardMentor = async (mentorData) => {
        const mentor = await onboardIncubatorMentor(user, mentorData);
        await refreshData();
        return mentor;
    };

    const createCohort = async (cohortData) => {
        await createIncubatorCohort(user, cohortData);
        await refreshData();
    };

    const assignStartupToCohort = async (startupId, cohortId) => {
        await assignStartupToIncubatorCohort(user, startupId, cohortId);
        await refreshData();
    };

    const removeStartupFromCohort = async (startupId, cohortId) => {
        await removeStartupFromIncubatorCohort(user, startupId, cohortId);
        await refreshData();
    };

    const updateSettings = async (nextSettings) => {
        setSettings(nextSettings);
    };

    const value = {
        profile,
        pipeline,
        applications,
        cohorts,
        mentors,
        acceptApplication,
        rejectApplication,
        onboardStartup,
        onboardMentor,
        assignMentorToStartup,
        removeMentorAssignment,
        createCohort,
        assignStartupToCohort,
        removeStartupFromCohort,
        analytics,
        alerts,
        highPotentialStartups,
        activityFeed,
        nextBatch,
        settings,
        updateSettings,
        loading
    };

    return (
        <IncubatorContext.Provider value={value}>
            {!loading && children}
        </IncubatorContext.Provider>
    );
};