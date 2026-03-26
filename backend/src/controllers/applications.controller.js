import * as applicationsService from '../services/applications.service.js';

export function getApplications(req, res) {
  const applications = applicationsService.getAllApplications();
  res.status(200).json({ data: applications });
}

export function getApplicationById(req, res) {
  const application = applicationsService.getApplicationById(req.params.application_id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}

export function createApplication(req, res) {
  const application = applicationsService.createApplication(req.body);
  res.status(201).json({ data: application });
}

export function updateApplication(req, res) {
  const application = applicationsService.updateApplication(req.params.application_id, req.body);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}

export function deleteApplication(req, res) {
  const application = applicationsService.deleteApplication(req.params.application_id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}

export function acceptApplication(req, res) {
  const application = applicationsService.acceptApplication(req.params.application_id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}

export function rejectApplication(req, res) {
  const application = applicationsService.rejectApplication(req.params.application_id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}

export function waitlistApplication(req, res) {
  const application = applicationsService.waitlistApplication(req.params.application_id);
  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ data: application });
}
