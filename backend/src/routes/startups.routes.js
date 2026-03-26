import { Router } from 'express';
import {
  addCoFounder,
  assignIncubator,
  assignMentor,
  createStartup,
  deleteStartup,
  getStartupById,
  getStartups,
  removeCoFounder,
  updateStartup
} from '../controllers/startups.controller.js';

const router = Router();

router.get('/', getStartups);
router.get('/:startup_id', getStartupById);
router.post('/', createStartup);
router.put('/:startup_id', updateStartup);
router.delete('/:startup_id', deleteStartup);

router.post('/:startup_id/co-founders', addCoFounder);
router.delete('/:startup_id/co-founders/:user_id', removeCoFounder);
router.post('/:startup_id/assign-mentor', assignMentor);
router.post('/:startup_id/assign-incubator', assignIncubator);

export default router;
