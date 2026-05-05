import { Router } from 'express';
import { authenticateFirebaseToken } from '../middlewares/auth.middleware.js';
import {
  createCohort,
  deleteCohort,
  getCohortById,
  getCohorts,
  joinCohort,
  leaveCohort,
  updateCohort
} from '../controllers/cohorts.controller.js';

const router = Router();

router.get('/', getCohorts);
router.get('/:cohort_id', getCohortById);
router.post('/', authenticateFirebaseToken, createCohort);
router.put('/:cohort_id', authenticateFirebaseToken, updateCohort);
router.delete('/:cohort_id', authenticateFirebaseToken, deleteCohort);

router.post('/:cohort_id/join', authenticateFirebaseToken, joinCohort);
router.post('/:cohort_id/leave', authenticateFirebaseToken, leaveCohort);

export default router;
