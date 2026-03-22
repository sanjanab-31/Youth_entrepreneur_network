import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /applications'));
router.get('/:application_id', routeWorking('GET /applications/:application_id'));
router.post('/', routeWorking('POST /applications'));
router.put('/:application_id', routeWorking('PUT /applications/:application_id'));
router.delete('/:application_id', routeWorking('DELETE /applications/:application_id'));

router.post('/:application_id/accept', routeWorking('POST /applications/:application_id/accept'));
router.post('/:application_id/reject', routeWorking('POST /applications/:application_id/reject'));
router.post('/:application_id/waitlist', routeWorking('POST /applications/:application_id/waitlist'));

export default router;
