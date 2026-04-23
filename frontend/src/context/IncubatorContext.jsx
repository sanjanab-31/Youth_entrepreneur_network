import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
    acceptIncubatorApplication,
    assignMentorForIncubatorStartup,
    deleteIncubatorCohort,
    assignStartupToIncubatorCohort,
    buildIncubatorDerivedState,
    createIncubatorCohort,
    getDefaultIncubatorSettings,
    loadIncubatorState,
    onboardIncubatorMentor,
    onboardIncubatorStartup,
    rejectIncubatorApplication,
    removeMentorForIncubatorStartup,
    removeStartupFromIncubatorCohort,
    updateIncubatorCohort
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
    const [applicationsLoading, setApplicationsLoading] = useState(true);
    const [applicationsError, setApplicationsError] = useState('');
    const [applicationActionId, setApplicationActionId] = useState(null);
    const [cohortsLoading, setCohortsLoading] = useState(true);
    const [cohortsError, setCohortsError] = useState('');
    const [cohortActionKey, setCohortActionKey] = useState(null);

    const refreshData = useCallback(async () => {
        setLoading(true);
        setApplicationsLoading(true);
        setCohortsLoading(true);
        setApplicationsError('');
        setCohortsError('');

        try {
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
        } catch (error) {
            setApplications([]);
            setCohorts([]);
            setApplicationsError(error.response?.data?.error || 'Failed to load applications');
            setCohortsError(error.response?.data?.error || 'Failed to load cohorts');
        }

        setLoading(false);
        setApplicationsLoading(false);
        setCohortsLoading(false);
    }, [user]);

    useEffect(() => {
        void refreshData();
    }, [user, refreshData]);

    useEffect(() => {
        const handler = (event) => {
            if (!event || event.key === 'vanguard_system') {
                void refreshData();
            }
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [refreshData]);

    const acceptApplication = async (appId, cohortId) => {
        setApplicationActionId(appId);
        setApplicationsError('');
        try {
            await acceptIncubatorApplication(user, appId, cohortId);
        } catch (error) {
            setApplicationsError(error.response?.data?.error || 'Failed to accept application');
        }
        await refreshData();
        setApplicationActionId(null);
    };

    const rejectApplication = async (appId) => {
        setApplicationActionId(appId);
        setApplicationsError('');
        try {
            await rejectIncubatorApplication(appId);
        } catch (error) {
            setApplicationsError(error.response?.data?.error || 'Failed to reject application');
        }
        await refreshData();
        setApplicationActionId(null);
    };

    const assignMentorToStartup = async (mentorId, startupId) => {
        await assignMentorForIncubatorStartup(mentorId, startupId);
        await refreshData();
    };

    const removeMentorAssignment = async (mentorId, startupId) => {
        await removeMentorForIncubatorStartup(mentorId, startupId, user?.uid);
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
        setCohortActionKey('create');
        setCohortsError('');
        try {
            await createIncubatorCohort(user, cohortData);
        } catch (error) {
            setCohortsError(error.response?.data?.error || 'Failed to create cohort');
        }
        await refreshData();
        setCohortActionKey(null);
    };

    const assignStartupToCohort = async (startupId, cohortId) => {
        setCohortActionKey(`assign:${startupId}:${cohortId}`);
        setCohortsError('');
        try {
            await assignStartupToIncubatorCohort(user, startupId, cohortId);
        } catch (error) {
            setCohortsError(error.response?.data?.error || 'Failed to add startup to cohort');
        }
        await refreshData();
        setCohortActionKey(null);
    };

    const removeStartupFromCohort = async (startupId, cohortId) => {
        setCohortActionKey(`remove:${startupId}:${cohortId}`);
        setCohortsError('');
        try {
            await removeStartupFromIncubatorCohort(user, startupId, cohortId);
        } catch (error) {
            setCohortsError(error.response?.data?.error || 'Failed to remove startup from cohort');
        }
        await refreshData();
        setCohortActionKey(null);
    };

    const updateCohort = async (cohortId, cohortData) => {
        setCohortActionKey(`update:${cohortId}`);
        setCohortsError('');
        try {
            await updateIncubatorCohort(cohortId, cohortData);
        } catch (error) {
            setCohortsError(error.response?.data?.error || 'Failed to update cohort');
        }
        await refreshData();
        setCohortActionKey(null);
    };

    const deleteCohort = async (cohortId) => {
        setCohortActionKey(`delete:${cohortId}`);
        setCohortsError('');
        try {
            await deleteIncubatorCohort(cohortId);
        } catch (error) {
            setCohortsError(error.response?.data?.error || 'Failed to delete cohort');
        }
        await refreshData();
        setCohortActionKey(null);
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
        updateCohort,
        deleteCohort,
        assignStartupToCohort,
        removeStartupFromCohort,
        analytics,
        alerts,
        highPotentialStartups,
        activityFeed,
        nextBatch,
        settings,
        updateSettings,
        loading,
        applicationsLoading,
        applicationsError,
        applicationActionId,
        cohortsLoading,
        cohortsError,
        cohortActionKey
    };

    return (
        <IncubatorContext.Provider value={value}>
            {!loading && children}
        </IncubatorContext.Provider>
    );
};