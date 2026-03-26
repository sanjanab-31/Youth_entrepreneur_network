import * as incubatorsService from '../services/incubators.service.js';

export function getIncubators(req, res) {
  const incubators = incubatorsService.getAllIncubators();
  res.status(200).json({ data: incubators });
}

export function getIncubatorById(req, res) {
  const incubator = incubatorsService.getIncubatorById(req.params.incubator_id);
  if (!incubator) {
    return res.status(404).json({ message: 'Incubator not found' });
  }

  return res.status(200).json({ data: incubator });
}

export function createIncubator(req, res) {
  const incubator = incubatorsService.createIncubator(req.body);
  res.status(201).json({ data: incubator });
}

export function updateIncubator(req, res) {
  const incubator = incubatorsService.updateIncubator(req.params.incubator_id, req.body);
  if (!incubator) {
    return res.status(404).json({ message: 'Incubator not found' });
  }

  return res.status(200).json({ data: incubator });
}

export function deleteIncubator(req, res) {
  const incubator = incubatorsService.deleteIncubator(req.params.incubator_id);
  if (!incubator) {
    return res.status(404).json({ message: 'Incubator not found' });
  }

  return res.status(200).json({ data: incubator });
}

export function addMentorToIncubator(req, res) {
  const incubator = incubatorsService.addMentorToIncubator(req.params.incubator_id, req.body.mentorId);
  if (!incubator) {
    return res.status(404).json({ message: 'Incubator not found' });
  }

  return res.status(200).json({ data: incubator });
}

export function removeMentorFromIncubator(req, res) {
  const incubator = incubatorsService.removeMentorFromIncubator(req.params.incubator_id, req.params.mentor_id);
  if (!incubator) {
    return res.status(404).json({ message: 'Incubator not found' });
  }

  return res.status(200).json({ data: incubator });
}
