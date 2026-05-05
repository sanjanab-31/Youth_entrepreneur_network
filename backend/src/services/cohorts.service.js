import { randomUUID } from 'crypto';
import pool from '../config/db.js';

const mapCohortRow = (row, startupIds = []) => {
  if (!row) return null;

  return {
    ...row,
    incubatorId: row.incubator_id,
    startDate: row.start_date,
    endDate: row.end_date,
    maxCapacity: row.max_capacity,
    memberStartupIds: startupIds,
    startupIds,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const getStartupIdsForCohort = async (cohortId) => {
  const { rows } = await pool.query(
    'SELECT startup_id FROM cohort_startups WHERE cohort_id = $1 ORDER BY added_at ASC',
    [cohortId]
  );

  return rows.map((row) => row.startup_id);
};

const ensureIncubatorExists = async (incubatorId) => {
  const incubatorResult = await pool.query('SELECT id FROM incubators WHERE id = $1', [incubatorId]);
  if (incubatorResult.rows[0]) {
    return;
  }

  const userResult = await pool.query(
    'SELECT id, name, role, portal_data FROM users WHERE id = $1',
    [incubatorId]
  );

  const user = userResult.rows[0];
  if (!user) {
    const error = new Error('Invalid incubatorId. The referenced incubator does not exist.');
    error.statusCode = 400;
    throw error;
  }

  const portalData = user.portal_data || {};
  const incubatorName = portalData.incubatorName || user.name || `Incubator ${incubatorId.slice(0, 8)}`;
  const stagePreference = portalData.stagePreference
    ? Array.isArray(portalData.stagePreference)
      ? portalData.stagePreference
      : [portalData.stagePreference]
    : [];
  const fundingSupport = Boolean(portalData.fundingSupport ?? false);
  const batchSize = Number(portalData.batchSize ?? 20);

  await pool.query(
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, FALSE, 0, '$0', 0, $10, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `,
    [
      incubatorId,
      incubatorName,
      incubatorName,
      portalData.location ?? null,
      portalData.description ?? null,
      portalData.website ?? null,
      stagePreference,
      fundingSupport,
      Number.isFinite(batchSize) && batchSize > 0 ? batchSize : 20,
      user.id
    ]
  );
};

export async function getAllCohorts() {
  try {
    const { rows } = await pool.query('SELECT * FROM cohorts ORDER BY created_at ASC');
    const mapped = await Promise.all(
      rows.map(async (row) => mapCohortRow(row, await getStartupIdsForCohort(row.id)))
    );
    return mapped;
  } catch (error) {
    throw new Error(`Failed to fetch cohorts: ${error.message}`);
  }
}

export async function getCohortById(cohortId) {
  try {
    const { rows } = await pool.query('SELECT * FROM cohorts WHERE id = $1', [cohortId]);
    if (!rows[0]) return null;

    const startupIds = await getStartupIdsForCohort(cohortId);
    return mapCohortRow(rows[0], startupIds);
  } catch (error) {
    throw new Error(`Failed to fetch cohort with id ${cohortId}: ${error.message}`);
  }
}

export async function createCohort(payload = {}, authenticatedUserId = null) {
  try {
    const id = payload.id || randomUUID();
    const incubatorId = payload.incubatorId ?? payload.incubator_id ?? authenticatedUserId ?? null;
    const name = payload.name || `Cohort ${id.slice(0, 8)}`;
    const startDateRaw = payload.startDate ?? payload.start_date ?? null;
    const endDateRaw = payload.endDate ?? payload.end_date ?? null;
    const startDate = startDateRaw === '' ? null : startDateRaw;
    const endDate = endDateRaw === '' ? null : endDateRaw;
    const maxCapacity = Number(payload.maxCapacity ?? payload.max_capacity ?? 20);
    const status = payload.status ?? 'upcoming';

    if (!incubatorId) {
      const error = new Error('incubatorId is required to create cohort');
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(maxCapacity) || maxCapacity <= 0) {
      const error = new Error('maxCapacity must be a positive number');
      error.statusCode = 400;
      throw error;
    }

    await ensureIncubatorExists(incubatorId);

    const { rows } = await pool.query(
      `
        INSERT INTO cohorts (
          id,
          incubator_id,
          name,
          start_date,
          end_date,
          max_capacity,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *
      `,
      [id, incubatorId, name, startDate, endDate, maxCapacity, status]
    );

    return mapCohortRow(rows[0], []);
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    if (error.code === '23503') {
      const dbError = new Error('Invalid incubatorId. The referenced incubator does not exist.');
      dbError.statusCode = 400;
      throw dbError;
    }

    if (error.code === '23502') {
      const dbError = new Error('Missing required cohort fields.');
      dbError.statusCode = 400;
      throw dbError;
    }

    throw new Error(`Failed to create cohort: ${error.message}`);
  }
}

export async function updateCohort(cohortId, payload = {}) {
  try {
    const incubatorId = payload.incubatorId ?? payload.incubator_id;
    const name = payload.name;
    const startDate = payload.startDate ?? payload.start_date;
    const endDate = payload.endDate ?? payload.end_date;
    const maxCapacity = payload.maxCapacity ?? payload.max_capacity;
    const status = payload.status;

    const updates = [];
    const values = [];
    let param = 2;

    if (incubatorId !== undefined) {
      updates.push(`incubator_id = $${param++}`);
      values.push(incubatorId);
    }
    if (name !== undefined) {
      updates.push(`name = $${param++}`);
      values.push(name);
    }
    if (startDate !== undefined) {
      updates.push(`start_date = $${param++}`);
      values.push(startDate);
    }
    if (endDate !== undefined) {
      updates.push(`end_date = $${param++}`);
      values.push(endDate);
    }
    if (maxCapacity !== undefined) {
      updates.push(`max_capacity = $${param++}`);
      values.push(Number(maxCapacity));
    }
    if (status !== undefined) {
      updates.push(`status = $${param++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return getCohortById(cohortId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE cohorts
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [cohortId, ...values]
    );

    if (!rows[0]) return null;

    const startupIds = await getStartupIdsForCohort(cohortId);
    return mapCohortRow(rows[0], startupIds);
  } catch (error) {
    throw new Error(`Failed to update cohort with id ${cohortId}: ${error.message}`);
  }
}

export async function deleteCohort(cohortId) {
  try {
    const { rows } = await pool.query('DELETE FROM cohorts WHERE id = $1 RETURNING *', [cohortId]);
    if (!rows[0]) return null;
    return mapCohortRow(rows[0], []);
  } catch (error) {
    throw new Error(`Failed to delete cohort with id ${cohortId}: ${error.message}`);
  }
}

export async function joinCohort(cohortId, startupId) {
  try {
    const cohort = await getCohortById(cohortId);
    if (!cohort) return null;

    await pool.query(
      `
        INSERT INTO cohort_startups (cohort_id, startup_id, added_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (cohort_id, startup_id) DO NOTHING
      `,
      [cohortId, startupId]
    );

    return getCohortById(cohortId);
  } catch (error) {
    throw new Error(`Failed to join startup ${startupId} to cohort ${cohortId}: ${error.message}`);
  }
}

export async function leaveCohort(cohortId, startupId) {
  try {
    const cohort = await getCohortById(cohortId);
    if (!cohort) return null;

    await pool.query(
      'DELETE FROM cohort_startups WHERE cohort_id = $1 AND startup_id = $2',
      [cohortId, startupId]
    );

    return getCohortById(cohortId);
  } catch (error) {
    throw new Error(`Failed to remove startup ${startupId} from cohort ${cohortId}: ${error.message}`);
  }
}
