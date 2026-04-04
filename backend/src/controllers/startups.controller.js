import * as startupsService from '../services/startups.service.js';

export async function getStartups(req, res) {
  try {
    const startups = await startupsService.getAllStartups();
    return res.status(200).json({ data: startups });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getStartupById(req, res) {
  try {
    const startup = await startupsService.getStartupById(req.params.startup_id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createStartup(req, res) {
  try {
    const startup = await startupsService.createStartup(req.body);
    return res.status(201).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateStartup(req, res) {
  try {
    const startup = await startupsService.updateStartup(req.params.startup_id, req.body);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteStartup(req, res) {
  try {
    const startup = await startupsService.deleteStartup(req.params.startup_id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function addCoFounder(req, res) {
  try {
    const startup = await startupsService.addCoFounder(req.params.startup_id, req.body.userId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function removeCoFounder(req, res) {
  try {
    const startup = await startupsService.removeCoFounder(req.params.startup_id, req.params.user_id);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function assignMentor(req, res) {
  try {
    const startup = await startupsService.assignMentor(req.params.startup_id, req.body.mentorId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function assignIncubator(req, res) {
  try {
    const startup = await startupsService.assignIncubator(req.params.startup_id, req.body.incubatorId);
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }

    return res.status(200).json({ data: startup });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
