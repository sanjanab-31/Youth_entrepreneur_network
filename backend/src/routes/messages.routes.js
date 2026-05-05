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

// Specific routes must come BEFORE parameterized routes to avoid route conflicts
router.get('/conversations/:startup_id', getConversationsByStartup);
router.post('/send', sendMessage);
router.post('/:message_id/read', markMessageAsRead);

// Generic routes with parameters
router.get('/', getMessages);
router.post('/', createMessage);
router.get('/:message_id', getMessageById);
router.put('/:message_id', updateMessage);
router.delete('/:message_id', deleteMessage);

export default router;
