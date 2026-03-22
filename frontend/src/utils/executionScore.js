/**
 * SINGLE SOURCE OF TRUTH for Execution Score calculation.
 * Both founder and mentor portals must import from here.
 * Never store executionScore as a field — always compute it.
 */

/**
 * Calculate profile completion percentage (0-100).
 * @param {object} startup
 */
export const calculateProfileCompletion = (startup) => {
    if (!startup) return 0;
    let score = 0;
    const total = 6;
    if (startup.problemStatement?.trim()) score++;
    if (startup.solutionOverview?.trim()) score++;
    if (Array.isArray(startup.milestones) && startup.milestones.length >= 3) score++;
    if (startup.skillGap?.trim()) score++;
    if (Array.isArray(startup.targetAudience) && startup.targetAudience.length > 0) score++;
    if (Array.isArray(startup.documents) && startup.documents.length > 0) score++;
    return Math.round((score / total) * 100);
};

/**
 * Calculate execution score (0-100) from a startup object.
 * Weights:
 *   Milestones completed  → 40%
 *   Profile completion    → 20%
 *   Mentor assigned       → 20%
 *   Traction updated      → 20%
 *
 * @param {object} startup
 * @returns {number} 0-100
 */
export const calculateExecutionScore = (startup) => {
    if (!startup) return 0;

    const milestones = Array.isArray(startup.milestones) ? startup.milestones : [];
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = milestones.length || 1;
    const milestonesWeight = (completedCount / totalMilestones) * 40;

    const profileWeight = (calculateProfileCompletion(startup) / 100) * 20;

    const mentorWeight = startup.mentorAssigned ? 20 : 0;

    const lastUpdated = new Date(startup.updatedAt || 0);
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const tractionWeight = lastUpdated > fourteenDaysAgo ? 20 : 0;

    return Math.min(100, Math.round(milestonesWeight + profileWeight + mentorWeight + tractionWeight));
};
