import * as sessionsService from '../services/sessions.service.js';

export function getSessions(req, res) {
  const sessions = sessionsService.getAllSessions();
  res.status(200).json({ data: sessions });
}

export function getSessionById(req, res) {
  const session = sessionsService.getSessionById(req.params.session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function createSession(req, res) {
  const session = sessionsService.createSession(req.body);
  res.status(201).json({ data: session });
}

export function updateSession(req, res) {
  const session = sessionsService.updateSession(req.params.session_id, req.body);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function deleteSession(req, res) {
  const session = sessionsService.deleteSession(req.params.session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function confirmSession(req, res) {
  const session = sessionsService.confirmSession(req.params.session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function cancelSession(req, res) {
  const session = sessionsService.cancelSession(req.params.session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function completeSession(req, res) {
  const session = sessionsService.completeSession(req.params.session_id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}

export function rescheduleSession(req, res) {
  const session = sessionsService.rescheduleSession(req.params.session_id, req.body.scheduledAt);
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  return res.status(200).json({ data: session });
}
