const startups = [
  { id: 's1', name: 'Orbit Labs', founderId: 'u1', status: 'active', mentorId: null, incubatorId: null, coFounderIds: [] }
];

export function getAllStartups() {
  return startups;
}

export function getStartupById(startupId) {
  return startups.find((startup) => startup.id === startupId) || null;
}

export function createStartup(payload = {}) {
  const newStartup = {
    id: `s${startups.length + 1}`,
    name: payload.name || `Startup ${startups.length + 1}`,
    founderId: payload.founderId || null,
    status: payload.status || 'draft',
    mentorId: null,
    incubatorId: null,
    coFounderIds: []
  };

  startups.push(newStartup);
  return newStartup;
}

export function updateStartup(startupId, payload = {}) {
  const startup = getStartupById(startupId);
  if (!startup) {
    return null;
  }

  Object.assign(startup, payload);
  return startup;
}

export function deleteStartup(startupId) {
  const index = startups.findIndex((startup) => startup.id === startupId);
  if (index === -1) {
    return null;
  }

  const [deletedStartup] = startups.splice(index, 1);
  return deletedStartup;
}

export function addCoFounder(startupId, userId) {
  const startup = getStartupById(startupId);
  if (!startup) {
    return null;
  }

  if (!startup.coFounderIds.includes(userId)) {
    startup.coFounderIds.push(userId);
  }

  return startup;
}

export function removeCoFounder(startupId, userId) {
  const startup = getStartupById(startupId);
  if (!startup) {
    return null;
  }

  startup.coFounderIds = startup.coFounderIds.filter((id) => id !== userId);
  return startup;
}

export function assignMentor(startupId, mentorId) {
  const startup = getStartupById(startupId);
  if (!startup) {
    return null;
  }

  startup.mentorId = mentorId;
  return startup;
}

export function assignIncubator(startupId, incubatorId) {
  const startup = getStartupById(startupId);
  if (!startup) {
    return null;
  }

  startup.incubatorId = incubatorId;
  return startup;
}
