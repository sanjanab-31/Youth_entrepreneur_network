import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /startups'));
router.get('/:startup_id', routeWorking('GET /startups/:startup_id'));
router.post('/', routeWorking('POST /startups'));
router.put('/:startup_id', routeWorking('PUT /startups/:startup_id'));
router.delete('/:startup_id', routeWorking('DELETE /startups/:startup_id'));

router.post('/:startup_id/co-founders', routeWorking('POST /startups/:startup_id/co-founders'));
router.delete('/:startup_id/co-founders/:user_id', routeWorking('DELETE /startups/:startup_id/co-founders/:user_id'));
router.post('/:startup_id/assign-mentor', routeWorking('POST /startups/:startup_id/assign-mentor'));
router.post('/:startup_id/assign-incubator', routeWorking('POST /startups/:startup_id/assign-incubator'));

export default router;
