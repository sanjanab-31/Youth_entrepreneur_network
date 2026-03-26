import { Router } from 'express';
import {
  addMentorToIncubator,
  createIncubator,
  deleteIncubator,
  getIncubatorById,
  getIncubators,
  removeMentorFromIncubator,
  updateIncubator
} from '../controllers/incubators.controller.js';

const router = Router();

router.get('/', getIncubators);
router.get('/:incubator_id', getIncubatorById);
router.post('/', createIncubator);
router.put('/:incubator_id', updateIncubator);
router.delete('/:incubator_id', deleteIncubator);

router.post('/:incubator_id/mentors', addMentorToIncubator);
router.delete('/:incubator_id/mentors/:mentor_id', removeMentorFromIncubator);

export default router;
