import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import * as usersService from './users.service.js';

const mapMessageRow = (row) => {
  if (!row) return null;

  return {
    ...row,
    startupId: row.startup_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    senderRole: row.sender_role,
    receiverId: row.receiver_id,
    conversationType: row.conversation_type,
    content: row.message,
    message: row.message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    read: Boolean(row.read)
  };
};

const resolveReadUserId = (message, userId) => {
  if (userId) return userId;
  if (message?.receiver_id) return message.receiver_id;
  if (message?.sender_id) return message.sender_id;
  return null;
};

export async function getAllMessages() {
  try {
    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
    return rows.map(mapMessageRow);
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
}

export async function getMessageById(messageId) {
  try {
    const { rows } = await pool.query('SELECT * FROM messages WHERE id = $1', [messageId]);
    return mapMessageRow(rows[0] || null);
  } catch (error) {
    throw new Error(`Failed to fetch message with id ${messageId}: ${error.message}`);
  }
}

export async function createMessage(payload = {}) {
  try {
    const id = payload.id || randomUUID();
    const startupId = payload.startupId ?? payload.startup_id ?? null;
    let senderId = payload.senderId ?? payload.sender_id ?? null;
    let senderName = payload.senderName ?? payload.sender_name ?? 'User';
    let senderRole = payload.senderRole ?? payload.sender_role ?? null;
    const receiverId = payload.receiverId ?? payload.receiver_id ?? null;
    const conversationType = payload.conversationType ?? payload.conversation_type ?? 'startup';
    const message = payload.message ?? payload.content ?? '';

    // If we have a senderId but are missing name/role, try to fetch from user profile
    if (senderId && (senderName === 'User' || !senderRole)) {
      const user = await usersService.getUserById(senderId).catch(() => null);
      if (user) {
        senderName = user.name || senderName;
        senderRole = user.role || senderRole;
      }
    }

    const { rows } = await pool.query(
      `
        INSERT INTO messages (
          id,
          startup_id,
          sender_id,
          sender_name,
          sender_role,
          receiver_id,
          conversation_type,
          message,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `,
      [id, startupId, senderId, senderName, senderRole, receiverId, conversationType, message]
    );

    return mapMessageRow(rows[0]);
  } catch (error) {
    throw new Error(`Failed to create message: ${error.message}`);
  }
}

export async function updateMessage(messageId, payload = {}) {
  try {
    const startupId = payload.startupId ?? payload.startup_id;
    const senderId = payload.senderId ?? payload.sender_id;
    const senderName = payload.senderName ?? payload.sender_name;
    const senderRole = payload.senderRole ?? payload.sender_role;
    const receiverId = payload.receiverId ?? payload.receiver_id;
    const conversationType = payload.conversationType ?? payload.conversation_type;
    const message = payload.message ?? payload.content;

    const updates = [];
    const values = [];
    let param = 2;

    if (startupId !== undefined) {
      updates.push(`startup_id = $${param++}`);
      values.push(startupId);
    }
    if (senderId !== undefined) {
      updates.push(`sender_id = $${param++}`);
      values.push(senderId);
    }
    if (senderName !== undefined) {
      updates.push(`sender_name = $${param++}`);
      values.push(senderName);
    }
    if (senderRole !== undefined) {
      updates.push(`sender_role = $${param++}`);
      values.push(senderRole);
    }
    if (receiverId !== undefined) {
      updates.push(`receiver_id = $${param++}`);
      values.push(receiverId);
    }
    if (conversationType !== undefined) {
      updates.push(`conversation_type = $${param++}`);
      values.push(conversationType);
    }
    if (message !== undefined) {
      updates.push(`message = $${param++}`);
      values.push(message);
    }

    if (updates.length === 0) {
      return getMessageById(messageId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE messages
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [messageId, ...values]
    );

    return mapMessageRow(rows[0] || null);
  } catch (error) {
    throw new Error(`Failed to update message with id ${messageId}: ${error.message}`);
  }
}

export async function deleteMessage(messageId) {
  try {
    const { rows } = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [messageId]);
    return mapMessageRow(rows[0] || null);
  } catch (error) {
    throw new Error(`Failed to delete message with id ${messageId}: ${error.message}`);
  }
}

export async function sendMessage(payload = {}) {
  return createMessage(payload);
}

export async function markMessageAsRead(messageId, userId = null) {
  try {
    const messageResult = await pool.query('SELECT * FROM messages WHERE id = $1', [messageId]);
    const message = messageResult.rows[0];
    if (!message) {
      return null;
    }

    const resolvedUserId = resolveReadUserId(message, userId);
    if (!resolvedUserId) {
      return mapMessageRow(message);
    }

    await pool.query(
      `
        INSERT INTO message_reads (message_id, user_id, read_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (message_id, user_id) DO UPDATE
        SET read_at = NOW()
      `,
      [messageId, resolvedUserId]
    );

    return mapMessageRow(message);
  } catch (error) {
    throw new Error(`Failed to mark message as read for id ${messageId}: ${error.message}`);
  }
}

export async function getConversationsByStartup(startupId) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM messages WHERE startup_id = $1 ORDER BY created_at ASC',
      [startupId]
    );

    return rows.map(mapMessageRow);
  } catch (error) {
    throw new Error(`Failed to fetch conversations for startup ${startupId}: ${error.message}`);
  }
}
