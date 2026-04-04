import { randomUUID } from 'crypto';
import pool from '../config/db.js';

const mapIncubatorRow = (row, mentorIds = []) => {
  if (!row) return null;

  return {
    ...row,
    incubatorId: row.incubator_id,
    incubatorName: row.incubator_name,
    stagePreference: row.stage_preference,
    fundingSupport: row.funding_support,
    batchSize: row.batch_size,
    successStats: {
      graduated: row.success_stats_graduated,
      raised: row.success_stats_raised,
      active: row.success_stats_active
    },
    ownerUserId: row.owner_user_id,
    mentorIds,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const getMentorIdsForIncubator = async (incubatorId) => {
  const { rows } = await pool.query(
    'SELECT mentor_id FROM incubator_mentors WHERE incubator_id = $1 ORDER BY mentor_id ASC',
    [incubatorId]
  );

  return rows.map((row) => row.mentor_id);
};

export async function getAllIncubators() {
  try {
    const { rows } = await pool.query('SELECT * FROM incubators ORDER BY created_at ASC');
    const mapped = await Promise.all(
      rows.map(async (row) => mapIncubatorRow(row, await getMentorIdsForIncubator(row.id)))
    );
    return mapped;
  } catch (error) {
    throw new Error(`Failed to fetch incubators: ${error.message}`);
  }
}

export async function getIncubatorById(incubatorId) {
  try {
    const { rows } = await pool.query('SELECT * FROM incubators WHERE id = $1', [incubatorId]);
    if (!rows[0]) return null;

    const mentorIds = await getMentorIdsForIncubator(incubatorId);
    return mapIncubatorRow(rows[0], mentorIds);
  } catch (error) {
    throw new Error(`Failed to fetch incubator with id ${incubatorId}: ${error.message}`);
  }
}

export async function createIncubator(payload = {}) {
  try {
    const id = payload.id || randomUUID();
    const name = payload.name || payload.incubatorName || `Incubator ${id.slice(0, 8)}`;
    const incubatorName = payload.incubatorName || payload.name || name;
    const location = payload.location ?? null;
    const description = payload.description ?? null;
    const website = payload.website ?? null;
    const stagePreference = Array.isArray(payload.stagePreference)
      ? payload.stagePreference
      : Array.isArray(payload.stage_preference)
        ? payload.stage_preference
        : [];
    const fundingSupport = Boolean(payload.fundingSupport ?? payload.funding_support ?? false);
    const batchSize = Number(payload.batchSize ?? payload.batch_size ?? 20);
    const verified = Boolean(payload.verified ?? false);
    const successStatsGraduated = Number(payload.successStats?.graduated ?? payload.success_stats_graduated ?? 0);
    const successStatsRaised = payload.successStats?.raised ?? payload.success_stats_raised ?? '$0';
    const successStatsActive = Number(payload.successStats?.active ?? payload.success_stats_active ?? 0);
    const ownerUserId = payload.ownerUserId ?? payload.owner_user_id ?? null;

    const { rows } = await pool.query(
      `
        INSERT INTO incubators (
          id,
          name,
          incubator_name,
          location,
          description,
          website,
          stage_preference,
          funding_support,
          batch_size,
          verified,
          success_stats_graduated,
          success_stats_raised,
          success_stats_active,
          owner_user_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW())
        RETURNING *
      `,
      [
        id,
        name,
        incubatorName,
        location,
        description,
        website,
        stagePreference,
        fundingSupport,
        batchSize,
        verified,
        successStatsGraduated,
        successStatsRaised,
        successStatsActive,
        ownerUserId
      ]
    );

    return mapIncubatorRow(rows[0], []);
  } catch (error) {
    throw new Error(`Failed to create incubator: ${error.message}`);
  }
}

export async function updateIncubator(incubatorId, payload = {}) {
  try {
    const incubatorName = payload.incubatorName ?? payload.incubator_name;
    const name = payload.name;
    const location = payload.location;
    const description = payload.description;
    const website = payload.website;
    const stagePreference = payload.stagePreference ?? payload.stage_preference;
    const fundingSupport = payload.fundingSupport ?? payload.funding_support;
    const batchSize = payload.batchSize ?? payload.batch_size;
    const verified = payload.verified;
    const successStatsGraduated = payload.successStats?.graduated ?? payload.success_stats_graduated;
    const successStatsRaised = payload.successStats?.raised ?? payload.success_stats_raised;
    const successStatsActive = payload.successStats?.active ?? payload.success_stats_active;
    const ownerUserId = payload.ownerUserId ?? payload.owner_user_id;

    const updates = [];
    const values = [];
    let param = 2;

    if (name !== undefined) {
      updates.push(`name = $${param++}`);
      values.push(name);
    }
    if (incubatorName !== undefined) {
      updates.push(`incubator_name = $${param++}`);
      values.push(incubatorName);
    }
    if (location !== undefined) {
      updates.push(`location = $${param++}`);
      values.push(location);
    }
    if (description !== undefined) {
      updates.push(`description = $${param++}`);
      values.push(description);
    }
    if (website !== undefined) {
      updates.push(`website = $${param++}`);
      values.push(website);
    }
    if (stagePreference !== undefined) {
      updates.push(`stage_preference = $${param++}`);
      values.push(Array.isArray(stagePreference) ? stagePreference : []);
    }
    if (fundingSupport !== undefined) {
      updates.push(`funding_support = $${param++}`);
      values.push(Boolean(fundingSupport));
    }
    if (batchSize !== undefined) {
      updates.push(`batch_size = $${param++}`);
      values.push(Number(batchSize));
    }
    if (verified !== undefined) {
      updates.push(`verified = $${param++}`);
      values.push(Boolean(verified));
    }
    if (successStatsGraduated !== undefined) {
      updates.push(`success_stats_graduated = $${param++}`);
      values.push(Number(successStatsGraduated));
    }
    if (successStatsRaised !== undefined) {
      updates.push(`success_stats_raised = $${param++}`);
      values.push(successStatsRaised);
    }
    if (successStatsActive !== undefined) {
      updates.push(`success_stats_active = $${param++}`);
      values.push(Number(successStatsActive));
    }
    if (ownerUserId !== undefined) {
      updates.push(`owner_user_id = $${param++}`);
      values.push(ownerUserId);
    }

    if (updates.length === 0) {
      return getIncubatorById(incubatorId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE incubators
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [incubatorId, ...values]
    );

    if (!rows[0]) return null;

    const mentorIds = await getMentorIdsForIncubator(incubatorId);
    return mapIncubatorRow(rows[0], mentorIds);
  } catch (error) {
    throw new Error(`Failed to update incubator with id ${incubatorId}: ${error.message}`);
  }
}

export async function deleteIncubator(incubatorId) {
  try {
    const { rows } = await pool.query('DELETE FROM incubators WHERE id = $1 RETURNING *', [incubatorId]);
    if (!rows[0]) return null;
    return mapIncubatorRow(rows[0], []);
  } catch (error) {
    throw new Error(`Failed to delete incubator with id ${incubatorId}: ${error.message}`);
  }
}

export async function addMentorToIncubator(incubatorId, mentorId) {
  try {
    const incubator = await getIncubatorById(incubatorId);
    if (!incubator) return null;

    await pool.query(
      `
        INSERT INTO incubator_mentors (incubator_id, mentor_id)
        VALUES ($1, $2)
        ON CONFLICT (incubator_id, mentor_id) DO NOTHING
      `,
      [incubatorId, mentorId]
    );

    return getIncubatorById(incubatorId);
  } catch (error) {
    throw new Error(`Failed to add mentor ${mentorId} to incubator ${incubatorId}: ${error.message}`);
  }
}

export async function removeMentorFromIncubator(incubatorId, mentorId) {
  try {
    const incubator = await getIncubatorById(incubatorId);
    if (!incubator) return null;

    await pool.query(
      'DELETE FROM incubator_mentors WHERE incubator_id = $1 AND mentor_id = $2',
      [incubatorId, mentorId]
    );

    return getIncubatorById(incubatorId);
  } catch (error) {
    throw new Error(`Failed to remove mentor ${mentorId} from incubator ${incubatorId}: ${error.message}`);
  }
}
