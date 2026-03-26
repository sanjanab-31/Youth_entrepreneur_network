import { Router } from 'express';
import {
  acceptApplication,
  createApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  rejectApplication,
  updateApplication,
  waitlistApplication
} from '../controllers/applications.controller.js';

const router = Router();

router.get('/', getApplications);
router.get('/:application_id', getApplicationById);
router.post('/', createApplication);
router.put('/:application_id', updateApplication);
router.delete('/:application_id', deleteApplication);

router.post('/:application_id/accept', acceptApplication);
router.post('/:application_id/reject', rejectApplication);
router.post('/:application_id/waitlist', waitlistApplication);

export default router;
