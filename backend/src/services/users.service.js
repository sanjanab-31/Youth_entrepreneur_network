import pool from '../config/db.js';
import { randomUUID } from 'crypto';

export async function getAllUsers() {
  const { rows } = await pool.query('SELECT * FROM users');
  return rows;
}

export async function getUserById(userId) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  return rows[0] || null;
}

export async function createUser(payload = {}) {
  const id = payload.id || randomUUID();
  const name = payload.name || 'New User';
  const email = payload.email || `new-user-${Date.now()}@example.com`;
  const role = payload.role || 'founder';

  const { rows } = await pool.query(
    `
      INSERT INTO users (id, name, email, role)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [id, name, email, role]
  );

  return rows[0];
}

export async function updateUser(userId, payload = {}) {
  const { rows } = await pool.query(
    `
      UPDATE users
      SET
        name = COALESCE($2, name),
        email = COALESCE($3, email),
        role = COALESCE($4, role),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [userId, payload.name ?? null, payload.email ?? null, payload.role ?? null]
  );

  return rows[0] || null;
}

export async function deleteUser(userId) {
  const { rows } = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
  return rows[0] || null;
}