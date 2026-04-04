import { randomUUID } from 'crypto';
import pool from '../config/db.js';

export async function getAllMentorRequests() {
  try {
    const { rows } = await pool.query('SELECT * FROM mentor_requests');
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch mentor requests: ${error.message}`);
  }
}

export async function getMentorRequestById(requestId) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM mentor_requests WHERE id = $1',
      [requestId]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch mentor request by id: ${error.message}`);
  }
}

export async function createMentorRequest(payload = {}) {
  try {
    const id = payload.id || randomUUID();
    const startupId = payload.startupId ?? payload.startup_id ?? null;
    const founderId = payload.founderId ?? payload.founder_id ?? null;
    const mentorId = payload.mentorId ?? payload.mentor_id ?? null;
    const status = payload.status || 'pending';
    const message = payload.message || null;

    const { rows } = await pool.query(
      `
        INSERT INTO mentor_requests (id, startup_id, founder_id, mentor_id, status, message)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [id, startupId, founderId, mentorId, status, message]
    );

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create mentor request: ${error.message}`);
  }
}

export async function updateMentorRequest(requestId, payload = {}) {
  try {
    const startupId = payload.startupId ?? payload.startup_id;
    const founderId = payload.founderId ?? payload.founder_id;
    const mentorId = payload.mentorId ?? payload.mentor_id;
    const status = payload.status;
    const message = payload.message;

    const updates = [];
    const values = [];
    let param = 2;

    if (startupId !== undefined) {
      updates.push(`startup_id = $${param++}`);
      values.push(startupId);
    }
    if (founderId !== undefined) {
      updates.push(`founder_id = $${param++}`);
      values.push(founderId);
    }
    if (mentorId !== undefined) {
      updates.push(`mentor_id = $${param++}`);
      values.push(mentorId);
    }
    if (status !== undefined) {
      updates.push(`status = $${param++}`);
      values.push(status);
    }
    if (message !== undefined) {
      updates.push(`message = $${param++}`);
      values.push(message);
    }

    if (updates.length === 0) {
      return getMentorRequestById(requestId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE mentor_requests
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [requestId, ...values]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update mentor request: ${error.message}`);
  }
}

export async function deleteMentorRequest(requestId) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM mentor_requests WHERE id = $1 RETURNING *',
      [requestId]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to delete mentor request: ${error.message}`);
  }
}

export async function acceptMentorRequest(requestId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE mentor_requests
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [requestId, 'accepted']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to accept mentor request: ${error.message}`);
  }
}

export async function rejectMentorRequest(requestId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE mentor_requests
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [requestId, 'rejected']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to reject mentor request: ${error.message}`);
  }
}
