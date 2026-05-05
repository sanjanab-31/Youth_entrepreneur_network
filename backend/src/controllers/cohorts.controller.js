import * as cohortsService from '../services/cohorts.service.js';

export async function getCohorts(req, res) {
  try {
    const cohorts = await cohortsService.getAllCohorts();
    res.status(200).json({ data: cohorts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCohortById(req, res) {
  try {
    const cohort = await cohortsService.getCohortById(req.params.cohort_id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    return res.status(200).json({ data: cohort });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createCohort(req, res) {
  try {
    const cohort = await cohortsService.createCohort(req.body, req.user?.uid);
    res.status(201).json({ data: cohort });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message, error: error.message });
  }
}

export async function updateCohort(req, res) {
  try {
    const cohort = await cohortsService.updateCohort(req.params.cohort_id, req.body);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    return res.status(200).json({ data: cohort });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message, error: error.message });
  }
}

export async function deleteCohort(req, res) {
  try {
    const cohort = await cohortsService.deleteCohort(req.params.cohort_id);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    return res.status(200).json({ data: cohort });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message, error: error.message });
  }
}

export async function joinCohort(req, res) {
  try {
    const cohort = await cohortsService.joinCohort(req.params.cohort_id, req.body.startupId);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    return res.status(200).json({ data: cohort });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message, error: error.message });
  }
}

export async function leaveCohort(req, res) {
  try {
    const cohort = await cohortsService.leaveCohort(req.params.cohort_id, req.body.startupId);
    if (!cohort) {
      return res.status(404).json({ message: 'Cohort not found' });
    }
    return res.status(200).json({ data: cohort });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message, error: error.message });
  }
}

