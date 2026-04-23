import pool from '../config/db.js';
import { randomUUID } from 'crypto';

export async function getAllStartups() {
  try {
    const { rows } = await pool.query('SELECT * FROM startups ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch startups: ${error.message}`);
  }
}

export async function getStartupById(startupId) {
  try {
    const { rows } = await pool.query('SELECT * FROM startups WHERE id = $1', [startupId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch startup with id ${startupId}: ${error.message}`);
  }
}

export async function getStartupByFounderId(founderId) {
  try {
    const { rows } = await pool.query('SELECT * FROM startups WHERE founder_id = $1', [founderId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch startup for founder ${founderId}: ${error.message}`);
  }
}

export async function createStartup(payload = {}) {
  try {
    const id = payload.id || payload.startupId || randomUUID();
    const founderId = payload.founder_id || payload.founderId || null;
    const startupName = payload.startup_name || payload.startupName || payload.name || 'New Startup';
    const sector = payload.sector || 'General';
    const stage = payload.stage || 'Idea';
    const teamSize = parseInt(payload.team_size || payload.teamSize || 1, 10);
    const problemStatement = payload.problem_statement || payload.problemStatement || '';
    const targetAudience = Array.isArray(payload.target_audience) ? payload.target_audience : (payload.targetAudience || []);
    const primarySkills = Array.isArray(payload.primary_skills) ? payload.primary_skills : (payload.primarySkills || []);
    const focusAreas = Array.isArray(payload.focus_areas) ? payload.focus_areas : (payload.focusAreas || []);

    const query = `
      INSERT INTO startups (
        id, founder_id, startup_name, sector, stage, team_size, 
        problem_statement, target_audience, primary_skills, focus_areas,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const { rows } = await pool.query(query, [
      id, founderId, startupName, sector, stage, teamSize,
      problemStatement, targetAudience, primarySkills, focusAreas
    ]);

    return rows[0];
  } catch (error) {
    console.error('Database error in createStartup:', error);
    throw new Error(`Failed to create startup: ${error.message}`);
  }
}


export async function updateStartup(startupId, payload = {}) {
  try {
    const updates = [];
    const values = [startupId];
    let paramIndex = 2;

    const fields = [
      'startup_name', 'sector', 'stage', 'status', 'mentor_assigned', 
      'incubator_assigned', 'cohort_id', 'execution_score', 'profile_completion'
    ];

    fields.forEach(field => {
      const camelField = field.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      const value = payload[field] ?? payload[camelField];
      if (value !== undefined) {
        updates.push(`${field} = $${paramIndex++}`);
        values.push(value);
      }
    });

    if (updates.length === 0) return await getStartupById(startupId);

    const query = `
      UPDATE startups 
      SET ${updates.join(', ')}, updated_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update startup: ${error.message}`);
  }
}

export async function deleteStartup(startupId) {
  try {
    const { rows } = await pool.query('DELETE FROM startups WHERE id = $1 RETURNING *', [startupId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to delete startup: ${error.message}`);
  }
}

export async function assignMentor(startupId, mentorId) {
  return await updateStartup(startupId, { mentor_assigned: mentorId });
}

export async function assignIncubator(startupId, incubatorId) {
  return await updateStartup(startupId, { incubator_assigned: incubatorId });
}

export async function addCoFounder(startupId, userId) {
  try {
    await pool.query(
      'INSERT INTO startup_co_founders (startup_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [startupId, userId]
    );
    return await getStartupById(startupId);
  } catch (error) {
    throw new Error(`Failed to add co-founder: ${error.message}`);
  }
}

export async function removeCoFounder(startupId, userId) {
  try {
    await pool.query(
      'DELETE FROM startup_co_founders WHERE startup_id = $1 AND user_id = $2',
      [startupId, userId]
    );
    return await getStartupById(startupId);
  } catch (error) {
    throw new Error(`Failed to remove co-founder: ${error.message}`);
  }
}

