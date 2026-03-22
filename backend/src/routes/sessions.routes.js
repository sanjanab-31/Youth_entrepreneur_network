import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /sessions'));
router.get('/:session_id', routeWorking('GET /sessions/:session_id'));
router.post('/', routeWorking('POST /sessions'));
router.put('/:session_id', routeWorking('PUT /sessions/:session_id'));
router.delete('/:session_id', routeWorking('DELETE /sessions/:session_id'));

router.post('/:session_id/confirm', routeWorking('POST /sessions/:session_id/confirm'));
router.post('/:session_id/cancel', routeWorking('POST /sessions/:session_id/cancel'));
router.post('/:session_id/complete', routeWorking('POST /sessions/:session_id/complete'));
router.post('/:session_id/reschedule', routeWorking('POST /sessions/:session_id/reschedule'));

export default router;
