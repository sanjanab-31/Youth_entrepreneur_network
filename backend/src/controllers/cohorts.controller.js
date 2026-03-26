import * as cohortsService from '../services/cohorts.service.js';

export function getCohorts(req, res) {
  const cohorts = cohortsService.getAllCohorts();
  res.status(200).json({ data: cohorts });
}

export function getCohortById(req, res) {
  const cohort = cohortsService.getCohortById(req.params.cohort_id);
  if (!cohort) {
    return res.status(404).json({ message: 'Cohort not found' });
  }

  return res.status(200).json({ data: cohort });
}

export function createCohort(req, res) {
  const cohort = cohortsService.createCohort(req.body);
  res.status(201).json({ data: cohort });
}

export function updateCohort(req, res) {
  const cohort = cohortsService.updateCohort(req.params.cohort_id, req.body);
  if (!cohort) {
    return res.status(404).json({ message: 'Cohort not found' });
  }

  return res.status(200).json({ data: cohort });
}

export function deleteCohort(req, res) {
  const cohort = cohortsService.deleteCohort(req.params.cohort_id);
  if (!cohort) {
    return res.status(404).json({ message: 'Cohort not found' });
  }

  return res.status(200).json({ data: cohort });
}

export function joinCohort(req, res) {
  const cohort = cohortsService.joinCohort(req.params.cohort_id, req.body.startupId);
  if (!cohort) {
    return res.status(404).json({ message: 'Cohort not found' });
  }

  return res.status(200).json({ data: cohort });
}

export function leaveCohort(req, res) {
  const cohort = cohortsService.leaveCohort(req.params.cohort_id, req.body.startupId);
  if (!cohort) {
    return res.status(404).json({ message: 'Cohort not found' });
  }

  return res.status(200).json({ data: cohort });
}
