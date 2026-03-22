import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /incubators'));
router.get('/:incubator_id', routeWorking('GET /incubators/:incubator_id'));
router.post('/', routeWorking('POST /incubators'));
router.put('/:incubator_id', routeWorking('PUT /incubators/:incubator_id'));
router.delete('/:incubator_id', routeWorking('DELETE /incubators/:incubator_id'));

router.post('/:incubator_id/mentors', routeWorking('POST /incubators/:incubator_id/mentors'));
router.delete('/:incubator_id/mentors/:mentor_id', routeWorking('DELETE /incubators/:incubator_id/mentors/:mentor_id'));

export default router;
