import { randomUUID } from 'crypto';
import pool from '../config/db.js';

const toNullableText = (value) => (value === undefined || value === null ? null : value);

const resolveDateTime = (payload = {}) => {
  if (payload.date !== undefined || payload.time !== undefined) {
    return {
      date: toNullableText(payload.date),
      time: toNullableText(payload.time)
    };
  }

  if (payload.scheduledAt) {
    const scheduledAt = new Date(payload.scheduledAt);
    if (!Number.isNaN(scheduledAt.getTime())) {
      return {
        date: scheduledAt.toISOString().slice(0, 10),
        time: scheduledAt.toISOString().slice(11, 19)
      };
    }
  }

  return {
    date: toNullableText(payload.date),
    time: toNullableText(payload.time)
  };
};

export async function getAllSessions() {
  try {
    const { rows } = await pool.query('SELECT * FROM sessions');
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch sessions: ${error.message}`);
  }
}

export async function getSessionById(sessionId) {
  try {
    const { rows } = await pool.query('SELECT * FROM sessions WHERE id = $1', [sessionId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch session with id ${sessionId}: ${error.message}`);
  }
}

export async function createSession(payload = {}) {
  try {
    const id = payload.id || randomUUID();
    const startupId = payload.startupId ?? payload.startup_id ?? null;
    const founderId = payload.founderId ?? payload.founder_id ?? null;
    const mentorId = payload.mentorId ?? payload.mentor_id ?? null;
    const incubatorId = payload.incubatorId ?? payload.incubator_id ?? null;
    const { date, time } = resolveDateTime(payload);
    const topic = payload.topic ?? null;
    const meetingLink = payload.meetingLink ?? payload.meeting_link ?? null;
    const status = payload.status ?? 'pending_confirmation';
    const notes = payload.notes ?? null;
    const actionItems = Array.isArray(payload.actionItems)
      ? payload.actionItems
      : Array.isArray(payload.action_items)
        ? payload.action_items
        : [];

    const { rows } = await pool.query(
      `
        INSERT INTO sessions (
          id,
          startup_id,
          founder_id,
          mentor_id,
          incubator_id,
          date,
          time,
          topic,
          meeting_link,
          status,
          notes,
          action_items,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        RETURNING *
      `,
      [id, startupId, founderId, mentorId, incubatorId, date, time, topic, meetingLink, status, notes, actionItems]
    );

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }
}

export async function updateSession(sessionId, payload = {}) {
  try {
    const startupId = payload.startupId ?? payload.startup_id;
    const founderId = payload.founderId ?? payload.founder_id;
    const mentorId = payload.mentorId ?? payload.mentor_id;
    const incubatorId = payload.incubatorId ?? payload.incubator_id;
    const { date, time } = resolveDateTime(payload);
    const topic = payload.topic;
    const meetingLink = payload.meetingLink ?? payload.meeting_link;
    const status = payload.status;
    const notes = payload.notes;
    const actionItems = payload.actionItems ?? payload.action_items;
    const completedAt = payload.completedAt ?? payload.completed_at;

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
    if (incubatorId !== undefined) {
      updates.push(`incubator_id = $${param++}`);
      values.push(incubatorId);
    }
    if (date !== undefined) {
      updates.push(`date = $${param++}`);
      values.push(date);
    }
    if (time !== undefined) {
      updates.push(`time = $${param++}`);
      values.push(time);
    }
    if (topic !== undefined) {
      updates.push(`topic = $${param++}`);
      values.push(topic);
    }
    if (meetingLink !== undefined) {
      updates.push(`meeting_link = $${param++}`);
      values.push(meetingLink);
    }
    if (status !== undefined) {
      updates.push(`status = $${param++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${param++}`);
      values.push(notes);
    }
    if (actionItems !== undefined) {
      updates.push(`action_items = $${param++}`);
      values.push(Array.isArray(actionItems) ? actionItems : []);
    }
    if (completedAt !== undefined) {
      updates.push(`completed_at = $${param++}`);
      values.push(completedAt);
    }

    if (updates.length === 0) {
      return getSessionById(sessionId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE sessions
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [sessionId, ...values]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update session with id ${sessionId}: ${error.message}`);
  }
}

export async function deleteSession(sessionId) {
  try {
    const { rows } = await pool.query('DELETE FROM sessions WHERE id = $1 RETURNING *', [sessionId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to delete session with id ${sessionId}: ${error.message}`);
  }
}

export async function confirmSession(sessionId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE sessions
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [sessionId, 'confirmed']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to confirm session with id ${sessionId}: ${error.message}`);
  }
}

export async function cancelSession(sessionId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE sessions
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [sessionId, 'cancelled']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to cancel session with id ${sessionId}: ${error.message}`);
  }
}

export async function completeSession(sessionId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE sessions
        SET status = $2, completed_at = NOW(), updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [sessionId, 'completed']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to complete session with id ${sessionId}: ${error.message}`);
  }
}

export async function rescheduleSession(sessionId, scheduledAt) {
  try {
    const dateTime = scheduledAt ? resolveDateTime({ scheduledAt }) : { date: null, time: null };

    const { rows } = await pool.query(
      `
        UPDATE sessions
        SET
          date = COALESCE($2, date),
          time = COALESCE($3, time),
          status = $4,
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [sessionId, dateTime.date, dateTime.time, 'rescheduled']
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to reschedule session with id ${sessionId}: ${error.message}`);
  }
}
