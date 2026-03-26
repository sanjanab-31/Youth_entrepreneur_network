const messages = [
  { id: 'm1', startupId: 's1', senderId: 'u1', receiverId: 'u2', content: 'Hello mentor', read: false }
];

export function getAllMessages() {
  return messages;
}

export function getMessageById(messageId) {
  return messages.find((message) => message.id === messageId) || null;
}

export function createMessage(payload = {}) {
  const newMessage = {
    id: `m${messages.length + 1}`,
    startupId: payload.startupId || null,
    senderId: payload.senderId || null,
    receiverId: payload.receiverId || null,
    content: payload.content || '',
    read: false
  };

  messages.push(newMessage);
  return newMessage;
}

export function updateMessage(messageId, payload = {}) {
  const message = getMessageById(messageId);
  if (!message) {
    return null;
  }

  Object.assign(message, payload);
  return message;
}

export function deleteMessage(messageId) {
  const index = messages.findIndex((message) => message.id === messageId);
  if (index === -1) {
    return null;
  }

  const [deletedMessage] = messages.splice(index, 1);
  return deletedMessage;
}

export function sendMessage(payload = {}) {
  return createMessage(payload);
}

export function markMessageAsRead(messageId) {
  const message = getMessageById(messageId);
  if (!message) {
    return null;
  }

  message.read = true;
  return message;
}

export function getConversationsByStartup(startupId) {
  return messages.filter((message) => message.startupId === startupId);
}
