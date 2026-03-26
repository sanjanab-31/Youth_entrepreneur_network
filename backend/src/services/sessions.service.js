const sessions = [
  { id: 'ss1', startupId: 's1', mentorId: 'u2', status: 'scheduled', scheduledAt: '2026-04-01T10:00:00Z' }
];

export function getAllSessions() {
  return sessions;
}

export function getSessionById(sessionId) {
  return sessions.find((session) => session.id === sessionId) || null;
}

export function createSession(payload = {}) {
  const newSession = {
    id: `ss${sessions.length + 1}`,
    startupId: payload.startupId || null,
    mentorId: payload.mentorId || null,
    status: 'scheduled',
    scheduledAt: payload.scheduledAt || new Date().toISOString()
  };

  sessions.push(newSession);
  return newSession;
}

export function updateSession(sessionId, payload = {}) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  Object.assign(session, payload);
  return session;
}

export function deleteSession(sessionId) {
  const index = sessions.findIndex((session) => session.id === sessionId);
  if (index === -1) {
    return null;
  }

  const [deletedSession] = sessions.splice(index, 1);
  return deletedSession;
}

export function confirmSession(sessionId) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'confirmed';
  return session;
}

export function cancelSession(sessionId) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'cancelled';
  return session;
}

export function completeSession(sessionId) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'completed';
  return session;
}

export function rescheduleSession(sessionId, scheduledAt) {
  const session = getSessionById(sessionId);
  if (!session) {
    return null;
  }

  session.status = 'rescheduled';
  session.scheduledAt = scheduledAt || session.scheduledAt;
  return session;
}
