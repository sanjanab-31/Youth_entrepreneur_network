import * as incubatorsService from '../services/incubators.service.js';

export async function getIncubators(req, res) {
  try {
    const incubators = await incubatorsService.getAllIncubators();
    res.status(200).json({ data: incubators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getIncubatorById(req, res) {
  try {
    const incubator = await incubatorsService.getIncubatorById(req.params.incubator_id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    return res.status(200).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createIncubator(req, res) {
  try {
    const incubator = await incubatorsService.createIncubator(req.body);
    res.status(201).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateIncubator(req, res) {
  try {
    const incubator = await incubatorsService.updateIncubator(req.params.incubator_id, req.body);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    return res.status(200).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteIncubator(req, res) {
  try {
    const incubator = await incubatorsService.deleteIncubator(req.params.incubator_id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    return res.status(200).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function addMentorToIncubator(req, res) {
  try {
    const incubator = await incubatorsService.addMentorToIncubator(req.params.incubator_id, req.body.mentorId);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    return res.status(200).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeMentorFromIncubator(req, res) {
  try {
    const incubator = await incubatorsService.removeMentorFromIncubator(req.params.incubator_id, req.params.mentor_id);
    if (!incubator) {
      return res.status(404).json({ message: 'Incubator not found' });
    }

    return res.status(200).json({ data: incubator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
