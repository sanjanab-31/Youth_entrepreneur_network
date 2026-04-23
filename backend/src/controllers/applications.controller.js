import * as applicationsService from '../services/applications.service.js';

export async function getApplications(req, res) {
  try {
    const applications = await applicationsService.getAllApplications();
    res.status(200).json({ data: applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getApplicationById(req, res) {
  try {
    const application = await applicationsService.getApplicationById(req.params.application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createApplication(req, res) {
  try {
    const application = await applicationsService.createApplication(req.body);
    res.status(201).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateApplication(req, res) {
  try {
    const application = await applicationsService.updateApplication(req.params.application_id, req.body);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteApplication(req, res) {
  try {
    const application = await applicationsService.deleteApplication(req.params.application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function acceptApplication(req, res) {
  try {
    const application = await applicationsService.acceptApplication(req.params.application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rejectApplication(req, res) {
  try {
    const application = await applicationsService.rejectApplication(req.params.application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function waitlistApplication(req, res) {
  try {
    const application = await applicationsService.waitlistApplication(req.params.application_id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json({ data: application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

