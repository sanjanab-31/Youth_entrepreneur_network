import * as startupsService from '../services/startups.service.js';

export function getStartups(req, res) {
  const startups = startupsService.getAllStartups();
  res.status(200).json({ data: startups });
}

export function getStartupById(req, res) {
  const startup = startupsService.getStartupById(req.params.startup_id);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function createStartup(req, res) {
  const startup = startupsService.createStartup(req.body);
  res.status(201).json({ data: startup });
}

export function updateStartup(req, res) {
  const startup = startupsService.updateStartup(req.params.startup_id, req.body);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function deleteStartup(req, res) {
  const startup = startupsService.deleteStartup(req.params.startup_id);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function addCoFounder(req, res) {
  const startup = startupsService.addCoFounder(req.params.startup_id, req.body.userId);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function removeCoFounder(req, res) {
  const startup = startupsService.removeCoFounder(req.params.startup_id, req.params.user_id);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function assignMentor(req, res) {
  const startup = startupsService.assignMentor(req.params.startup_id, req.body.mentorId);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}

export function assignIncubator(req, res) {
  const startup = startupsService.assignIncubator(req.params.startup_id, req.body.incubatorId);
  if (!startup) {
    return res.status(404).json({ message: 'Startup not found' });
  }

  return res.status(200).json({ data: startup });
}
