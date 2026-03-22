import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /messages'));
router.get('/:message_id', routeWorking('GET /messages/:message_id'));
router.post('/', routeWorking('POST /messages'));
router.put('/:message_id', routeWorking('PUT /messages/:message_id'));
router.delete('/:message_id', routeWorking('DELETE /messages/:message_id'));

router.post('/send', routeWorking('POST /messages/send'));
router.post('/:message_id/read', routeWorking('POST /messages/:message_id/read'));
router.get('/conversations/:startup_id', routeWorking('GET /messages/conversations/:startup_id'));

export default router;
