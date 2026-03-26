import { Router } from 'express';
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
router.post('/', createCohort);
router.put('/:cohort_id', updateCohort);
router.delete('/:cohort_id', deleteCohort);

router.post('/:cohort_id/join', joinCohort);
router.post('/:cohort_id/leave', leaveCohort);

export default router;
