import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  getConversationsByStartup,
  getMessageById,
  getMessages,
  markMessageAsRead,
  sendMessage,
  updateMessage
} from '../controllers/messages.controller.js';

const router = Router();

router.get('/', getMessages);
router.get('/:message_id', getMessageById);
router.post('/', createMessage);
router.put('/:message_id', updateMessage);
router.delete('/:message_id', deleteMessage);

router.post('/send', sendMessage);
router.post('/:message_id/read', markMessageAsRead);
router.get('/conversations/:startup_id', getConversationsByStartup);

export default router;
