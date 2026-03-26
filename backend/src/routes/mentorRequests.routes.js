import { Router } from 'express';
import {
  acceptMentorRequest,
  createMentorRequest,
  deleteMentorRequest,
  getMentorRequestById,
  getMentorRequests,
  rejectMentorRequest,
  updateMentorRequest
} from '../controllers/mentorRequests.controller.js';

const router = Router();

router.get('/', getMentorRequests);
router.get('/:request_id', getMentorRequestById);
router.post('/', createMentorRequest);
router.put('/:request_id', updateMentorRequest);
router.delete('/:request_id', deleteMentorRequest);

router.post('/:request_id/accept', acceptMentorRequest);
router.post('/:request_id/reject', rejectMentorRequest);

export default router;
