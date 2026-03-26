const cohorts = [
  { id: 'c1', name: 'Spring 2026', memberStartupIds: ['s1'] }
];

export function getAllCohorts() {
  return cohorts;
}

export function getCohortById(cohortId) {
  return cohorts.find((cohort) => cohort.id === cohortId) || null;
}

export function createCohort(payload = {}) {
  const newCohort = {
    id: `c${cohorts.length + 1}`,
    name: payload.name || `Cohort ${cohorts.length + 1}`,
    memberStartupIds: []
  };

  cohorts.push(newCohort);
  return newCohort;
}

export function updateCohort(cohortId, payload = {}) {
  const cohort = getCohortById(cohortId);
  if (!cohort) {
    return null;
  }

  Object.assign(cohort, payload);
  return cohort;
}

export function deleteCohort(cohortId) {
  const index = cohorts.findIndex((cohort) => cohort.id === cohortId);
  if (index === -1) {
    return null;
  }

  const [deletedCohort] = cohorts.splice(index, 1);
  return deletedCohort;
}

export function joinCohort(cohortId, startupId) {
  const cohort = getCohortById(cohortId);
  if (!cohort) {
    return null;
  }

  if (!cohort.memberStartupIds.includes(startupId)) {
    cohort.memberStartupIds.push(startupId);
  }

  return cohort;
}

export function leaveCohort(cohortId, startupId) {
  const cohort = getCohortById(cohortId);
  if (!cohort) {
    return null;
  }

  cohort.memberStartupIds = cohort.memberStartupIds.filter((id) => id !== startupId);
  return cohort;
}
