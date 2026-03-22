import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /cohorts'));
router.get('/:cohort_id', routeWorking('GET /cohorts/:cohort_id'));
router.post('/', routeWorking('POST /cohorts'));
router.put('/:cohort_id', routeWorking('PUT /cohorts/:cohort_id'));
router.delete('/:cohort_id', routeWorking('DELETE /cohorts/:cohort_id'));

router.post('/:cohort_id/join', routeWorking('POST /cohorts/:cohort_id/join'));
router.post('/:cohort_id/leave', routeWorking('POST /cohorts/:cohort_id/leave'));

export default router;
