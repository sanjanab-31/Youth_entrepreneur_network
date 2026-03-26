import { Router } from 'express';
import {
  cancelSession,
  completeSession,
  confirmSession,
  createSession,
  deleteSession,
  getSessionById,
  getSessions,
  rescheduleSession,
  updateSession
} from '../controllers/sessions.controller.js';

const router = Router();

router.get('/', getSessions);
router.get('/:session_id', getSessionById);
router.post('/', createSession);
router.put('/:session_id', updateSession);
router.delete('/:session_id', deleteSession);

router.post('/:session_id/confirm', confirmSession);
router.post('/:session_id/cancel', cancelSession);
router.post('/:session_id/complete', completeSession);
router.post('/:session_id/reschedule', rescheduleSession);

export default router;
