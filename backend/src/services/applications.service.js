import { randomUUID } from 'crypto';
import pool from '../config/db.js';

export async function getAllApplications() {
  try {
    const { rows } = await pool.query('SELECT * FROM applications');
    return rows;
  } catch (error) {
    throw new Error(`Failed to fetch applications: ${error.message}`);
  }
}

export async function getApplicationById(applicationId) {
  try {
    const { rows } = await pool.query('SELECT * FROM applications WHERE id = $1', [applicationId]);
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to fetch application with id ${applicationId}: ${error.message}`);
  }
}

export async function createApplication(payload = {}) {
  try {
    const id = payload.id || randomUUID();
    const startupId = payload.startupId ?? payload.startup_id ?? null;
    const founderId = payload.founderId ?? payload.founder_id ?? null;
    const incubatorId = payload.incubatorId ?? payload.incubator_id ?? null;
    const startupName = payload.startupName ?? payload.startup_name ?? null;
    const sector = payload.sector ?? null;
    const teamSize = payload.teamSize ?? payload.team_size ?? null;
    const status = payload.status ?? 'pending';
    const message = payload.message ?? null;
    const cohortId = payload.cohortId ?? payload.cohort_id ?? null;

    const { rows } = await pool.query(
      `
        INSERT INTO applications (
          id,
          startup_id,
          founder_id,
          incubator_id,
          startup_name,
          sector,
          team_size,
          status,
          message,
          cohort_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        RETURNING *
      `,
      [id, startupId, founderId, incubatorId, startupName, sector, teamSize, status, message, cohortId]
    );

    return rows[0];
  } catch (error) {
    throw new Error(`Failed to create application: ${error.message}`);
  }
}

export async function updateApplication(applicationId, payload = {}) {
  try {
    const startupId = payload.startupId ?? payload.startup_id;
    const founderId = payload.founderId ?? payload.founder_id;
    const incubatorId = payload.incubatorId ?? payload.incubator_id;
    const startupName = payload.startupName ?? payload.startup_name;
    const sector = payload.sector;
    const teamSize = payload.teamSize ?? payload.team_size;
    const status = payload.status;
    const message = payload.message;
    const cohortId = payload.cohortId ?? payload.cohort_id;

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
    if (incubatorId !== undefined) {
      updates.push(`incubator_id = $${param++}`);
      values.push(incubatorId);
    }
    if (startupName !== undefined) {
      updates.push(`startup_name = $${param++}`);
      values.push(startupName);
    }
    if (sector !== undefined) {
      updates.push(`sector = $${param++}`);
      values.push(sector);
    }
    if (teamSize !== undefined) {
      updates.push(`team_size = $${param++}`);
      values.push(teamSize);
    }
    if (status !== undefined) {
      updates.push(`status = $${param++}`);
      values.push(status);
    }
    if (message !== undefined) {
      updates.push(`message = $${param++}`);
      values.push(message);
    }
    if (cohortId !== undefined) {
      updates.push(`cohort_id = $${param++}`);
      values.push(cohortId);
    }

    if (updates.length === 0) {
      return getApplicationById(applicationId);
    }

    updates.push('updated_at = NOW()');

    const { rows } = await pool.query(
      `
        UPDATE applications
        SET ${updates.join(', ')}
        WHERE id = $1
        RETURNING *
      `,
      [applicationId, ...values]
    );

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to update application with id ${applicationId}: ${error.message}`);
  }
}

export async function deleteApplication(applicationId) {
  try {
    const { rows } = await pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING *',
      [applicationId]
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to delete application with id ${applicationId}: ${error.message}`);
  }
}

export async function acceptApplication(applicationId) {
  try {
    const applicationResult = await pool.query(
      'SELECT id, startup_id, incubator_id, cohort_id FROM applications WHERE id = $1',
      [applicationId]
    );
    const application = applicationResult.rows[0];

    if (!application) {
      return null;
    }

    const { rows } = await pool.query(
      `
        UPDATE applications
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [applicationId, 'accepted']
    );

    if (application.startup_id) {
      const startupUpdateValues = [application.incubator_id ?? null];
      const startupSetClauses = ['incubator_assigned = $2'];

      if (application.cohort_id !== null && application.cohort_id !== undefined) {
        startupSetClauses.push('cohort_id = $3');
        startupUpdateValues.push(application.cohort_id);
      }

      startupSetClauses.push('updated_at = NOW()');

      await pool.query(
        `
          UPDATE startups
          SET ${startupSetClauses.join(', ')}
          WHERE id = $1
        `,
        [application.startup_id, ...startupUpdateValues]
      );
    }

    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to accept application with id ${applicationId}: ${error.message}`);
  }
}

export async function rejectApplication(applicationId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE applications
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `,
      [applicationId, 'rejected']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to reject application with id ${applicationId}: ${error.message}`);
  }
}

export async function waitlistApplication(applicationId) {
  try {
    const { rows } = await pool.query(
      `
        UPDATE applications
        SET status = $2, updated_at = NOW() 
        WHERE id = $1
        RETURNING *
      `,
      [applicationId, 'waitlisted']
    );
    return rows[0] || null;
  } catch (error) {
    throw new Error(`Failed to waitlist application with id ${applicationId}: ${error.message}`);
  }
}
