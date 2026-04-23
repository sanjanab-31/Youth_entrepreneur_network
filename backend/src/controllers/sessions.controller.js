import * as sessionsService from '../services/sessions.service.js';

export async function getSessions(req, res) {
  try {
    const sessions = await sessionsService.getAllSessions();
    res.status(200).json({ data: sessions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getSessionById(req, res) {
  try {
    const session = await sessionsService.getSessionById(req.params.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createSession(req, res) {
  try {
    const session = await sessionsService.createSession(req.body);
    res.status(201).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSession(req, res) {
  try {
    const session = await sessionsService.updateSession(req.params.session_id, req.body);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteSession(req, res) {
  try {
    const session = await sessionsService.deleteSession(req.params.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function confirmSession(req, res) {
  try {
    const session = await sessionsService.confirmSession(req.params.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelSession(req, res) {
  try {
    const session = await sessionsService.cancelSession(req.params.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function completeSession(req, res) {
  try {
    const session = await sessionsService.completeSession(req.params.session_id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rescheduleSession(req, res) {
  try {
    const session = await sessionsService.rescheduleSession(req.params.session_id, req.body.scheduledAt);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    return res.status(200).json({ data: session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

