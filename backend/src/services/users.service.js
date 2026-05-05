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
  const id = payload.id || payload.uid || randomUUID();
  const name = payload.name || 'New User';
  const email = payload.email || `new-user-${Date.now()}@example.com`;
  const role = payload.role || 'founder';
  const portalData = payload.portal_data || payload.portalData || {};
  const profileData = payload.profile_data || payload.profileData || {};

  const { rows } = await pool.query(
    `
      INSERT INTO users (id, name, email, role, portal_data, profile_data, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (email) DO UPDATE
      SET 
        id = EXCLUDED.id,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        updated_at = NOW()
      RETURNING *
    `,
    [id, name, email, role, portalData, profileData]
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