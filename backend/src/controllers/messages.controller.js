import * as messagesService from '../services/messages.service.js';

export async function getMessages(req, res) {
  try {
    const messages = await messagesService.getAllMessages();
    res.status(200).json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMessageById(req, res) {
  try {
    const message = await messagesService.getMessageById(req.params.message_id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createMessage(req, res) {
  try {
    const message = await messagesService.createMessage(req.body);
    res.status(201).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateMessage(req, res) {
  try {
    const message = await messagesService.updateMessage(req.params.message_id, req.body);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteMessage(req, res) {
  try {
    const message = await messagesService.deleteMessage(req.params.message_id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const message = await messagesService.sendMessage({
      ...req.body,
      senderId: req.user.uid
    });
    res.status(201).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function markMessageAsRead(req, res) {
  try {
    const message = await messagesService.markMessageAsRead(req.params.message_id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    return res.status(200).json({ data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getConversationsByStartup(req, res) {
  try {
    const conversations = await messagesService.getConversationsByStartup(req.params.startup_id);
    return res.status(200).json({ data: conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
