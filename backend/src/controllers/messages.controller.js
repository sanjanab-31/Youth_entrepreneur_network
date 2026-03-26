import * as messagesService from '../services/messages.service.js';

export function getMessages(req, res) {
  const messages = messagesService.getAllMessages();
  res.status(200).json({ data: messages });
}

export function getMessageById(req, res) {
  const message = messagesService.getMessageById(req.params.message_id);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  return res.status(200).json({ data: message });
}

export function createMessage(req, res) {
  const message = messagesService.createMessage(req.body);
  res.status(201).json({ data: message });
}

export function updateMessage(req, res) {
  const message = messagesService.updateMessage(req.params.message_id, req.body);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  return res.status(200).json({ data: message });
}

export function deleteMessage(req, res) {
  const message = messagesService.deleteMessage(req.params.message_id);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  return res.status(200).json({ data: message });
}

export function sendMessage(req, res) {
  const message = messagesService.sendMessage(req.body);
  res.status(201).json({ data: message });
}

export function markMessageAsRead(req, res) {
  const message = messagesService.markMessageAsRead(req.params.message_id);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  return res.status(200).json({ data: message });
}

export function getConversationsByStartup(req, res) {
  const conversations = messagesService.getConversationsByStartup(req.params.startup_id);
  return res.status(200).json({ data: conversations });
}
