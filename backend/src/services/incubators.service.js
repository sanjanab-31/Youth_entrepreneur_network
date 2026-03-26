const incubators = [
  { id: 'i1', name: 'Scale Hub', mentorIds: ['u2'] }
];

export function getAllIncubators() {
  return incubators;
}

export function getIncubatorById(incubatorId) {
  return incubators.find((incubator) => incubator.id === incubatorId) || null;
}

export function createIncubator(payload = {}) {
  const newIncubator = {
    id: `i${incubators.length + 1}`,
    name: payload.name || `Incubator ${incubators.length + 1}`,
    mentorIds: []
  };

  incubators.push(newIncubator);
  return newIncubator;
}

export function updateIncubator(incubatorId, payload = {}) {
  const incubator = getIncubatorById(incubatorId);
  if (!incubator) {
    return null;
  }

  Object.assign(incubator, payload);
  return incubator;
}

export function deleteIncubator(incubatorId) {
  const index = incubators.findIndex((incubator) => incubator.id === incubatorId);
  if (index === -1) {
    return null;
  }

  const [deletedIncubator] = incubators.splice(index, 1);
  return deletedIncubator;
}

export function addMentorToIncubator(incubatorId, mentorId) {
  const incubator = getIncubatorById(incubatorId);
  if (!incubator) {
    return null;
  }

  if (!incubator.mentorIds.includes(mentorId)) {
    incubator.mentorIds.push(mentorId);
  }

  return incubator;
}

export function removeMentorFromIncubator(incubatorId, mentorId) {
  const incubator = getIncubatorById(incubatorId);
  if (!incubator) {
    return null;
  }

  incubator.mentorIds = incubator.mentorIds.filter((id) => id !== mentorId);
  return incubator;
}
