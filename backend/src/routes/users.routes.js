import { Router } from 'express';

const router = Router();

const routeWorking = (name) => (req, res) => {
  res.json({ message: 'Route working', route: name });
};

router.get('/', routeWorking('GET /users'));
router.get('/:user_id', routeWorking('GET /users/:user_id'));
router.post('/', routeWorking('POST /users'));
router.put('/:user_id', routeWorking('PUT /users/:user_id'));
router.delete('/:user_id', routeWorking('DELETE /users/:user_id'));

export default router;
