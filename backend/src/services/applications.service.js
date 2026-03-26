const applications = [
  { id: 'a1', startupId: 's1', cohortId: 'c1', status: 'pending' }
];

export function getAllApplications() {
  return applications;
}

export function getApplicationById(applicationId) {
  return applications.find((application) => application.id === applicationId) || null;
}

export function createApplication(payload = {}) {
  const newApplication = {
    id: `a${applications.length + 1}`,
    startupId: payload.startupId || null,
    cohortId: payload.cohortId || null,
    status: 'pending'
  };

  applications.push(newApplication);
  return newApplication;
}

export function updateApplication(applicationId, payload = {}) {
  const application = getApplicationById(applicationId);
  if (!application) {
    return null;
  }

  Object.assign(application, payload);
  return application;
}

export function deleteApplication(applicationId) {
  const index = applications.findIndex((application) => application.id === applicationId);
  if (index === -1) {
    return null;
  }

  const [deletedApplication] = applications.splice(index, 1);
  return deletedApplication;
}

export function acceptApplication(applicationId) {
  const application = getApplicationById(applicationId);
  if (!application) {
    return null;
  }

  application.status = 'accepted';
  return application;
}

export function rejectApplication(applicationId) {
  const application = getApplicationById(applicationId);
  if (!application) {
    return null;
  }

  application.status = 'rejected';
  return application;
}

export function waitlistApplication(applicationId) {
  const application = getApplicationById(applicationId);
  if (!application) {
    return null;
  }

  application.status = 'waitlisted';
  return application;
}
