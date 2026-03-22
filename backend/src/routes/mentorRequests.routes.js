import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /mentor-requests'));
router.get('/:request_id', routeWorking('GET /mentor-requests/:request_id'));
router.post('/', routeWorking('POST /mentor-requests'));
router.put('/:request_id', routeWorking('PUT /mentor-requests/:request_id'));
router.delete('/:request_id', routeWorking('DELETE /mentor-requests/:request_id'));

router.post('/:request_id/accept', routeWorking('POST /mentor-requests/:request_id/accept'));
router.post('/:request_id/reject', routeWorking('POST /mentor-requests/:request_id/reject'));

export default router;
