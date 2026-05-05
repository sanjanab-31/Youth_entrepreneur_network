-- PostgreSQL schema for YEN backend
-- Entity mapping: user -> users table to avoid reserved-word conflicts.

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('founder', 'co-founder', 'mentor', 'incubator', 'admin')),
    name TEXT NOT NULL,
    primary_skills TEXT[] NOT NULL DEFAULT '{}',
    expertise TEXT[] NOT NULL DEFAULT '{}',
    sector TEXT,
    bio TEXT,
    availability JSONB,
    badge TEXT,
    response_rate NUMERIC(5,2),
    company TEXT,
    user_role TEXT,
    linkedin TEXT,
    capacity INTEGER,
    portal_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    profile_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS incubators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    incubator_name TEXT NOT NULL,
    location TEXT,
    description TEXT,
    website TEXT,
    stage_preference TEXT[] NOT NULL DEFAULT '{}',
    funding_support BOOLEAN NOT NULL DEFAULT FALSE,
    batch_size INTEGER NOT NULL DEFAULT 20 CHECK (batch_size > 0),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    success_stats_graduated INTEGER NOT NULL DEFAULT 0,
    success_stats_raised TEXT NOT NULL DEFAULT '$0',
    success_stats_active INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    owner_user_id TEXT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS cohorts (
    id TEXT PRIMARY KEY,
    incubator_id TEXT NOT NULL REFERENCES incubators(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    max_capacity INTEGER NOT NULL DEFAULT 20 CHECK (max_capacity > 0),
    status TEXT NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS startups (
    id TEXT PRIMARY KEY,
    founder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_name TEXT NOT NULL,
    sector TEXT NOT NULL DEFAULT 'General',
    stage TEXT NOT NULL DEFAULT 'Idea',
    one_liner TEXT,
    solution_overview TEXT,
    problem_statement TEXT,
    target_audience TEXT[] NOT NULL DEFAULT '{}',
    market_info TEXT,
    growth TEXT,
    revenue TEXT,
    traction TEXT,
    traction_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    funding_goal TEXT,
    active_users INTEGER NOT NULL DEFAULT 0 CHECK (active_users >= 0),
    burn_rate INTEGER NOT NULL DEFAULT 0,
    demo_link TEXT,
    pitch_deck_link TEXT,
    website TEXT,
    location TEXT,
    commitment TEXT,
    equity TEXT,
    skill_gap TEXT,
    primary_skills TEXT[] NOT NULL DEFAULT '{}',
    team_size INTEGER NOT NULL DEFAULT 1 CHECK (team_size >= 1),
    focus_areas TEXT[] NOT NULL DEFAULT '{}',
    mentorship_start_date TIMESTAMPTZ,
    execution_score NUMERIC(10,2) NOT NULL DEFAULT 0,
    profile_completion NUMERIC(5,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active',
    mentor_assigned TEXT REFERENCES users(id) ON DELETE SET NULL,
    incubator_assigned TEXT REFERENCES incubators(id) ON DELETE SET NULL,
    cohort_id TEXT REFERENCES cohorts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_requests (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    founder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    founder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    incubator_id TEXT NOT NULL REFERENCES incubators(id) ON DELETE CASCADE,
    startup_name TEXT,
    sector TEXT,
    team_size INTEGER CHECK (team_size >= 1),
    status TEXT NOT NULL DEFAULT 'pending',
    message TEXT,
    applied_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    cohort_id TEXT REFERENCES cohorts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    founder_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    incubator_id TEXT REFERENCES incubators(id) ON DELETE SET NULL,
    date TEXT,
    time TEXT,
    topic TEXT,
    meeting_link TEXT,
    status TEXT NOT NULL DEFAULT 'pending_confirmation',
    notes TEXT,
    action_items TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_role TEXT,
    receiver_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    conversation_type TEXT NOT NULL DEFAULT 'startup',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Normalized link tables for array-style frontend fields
CREATE TABLE IF NOT EXISTS startup_co_founders (
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (startup_id, user_id)
);

CREATE TABLE IF NOT EXISTS cohort_startups (
    cohort_id TEXT NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
    startup_id TEXT NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cohort_id, startup_id)
);

CREATE TABLE IF NOT EXISTS incubator_sector_focus (
    incubator_id TEXT NOT NULL REFERENCES incubators(id) ON DELETE CASCADE,
    sector TEXT NOT NULL,
    PRIMARY KEY (incubator_id, sector)
);

CREATE TABLE IF NOT EXISTS incubator_mentors (
    incubator_id TEXT NOT NULL REFERENCES incubators(id) ON DELETE CASCADE,
    mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (incubator_id, mentor_id)
);

CREATE TABLE IF NOT EXISTS message_reads (
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_startups_founder_id ON startups(founder_id);
CREATE INDEX IF NOT EXISTS idx_startups_mentor_assigned ON startups(mentor_assigned);
CREATE INDEX IF NOT EXISTS idx_startups_incubator_assigned ON startups(incubator_assigned);
CREATE INDEX IF NOT EXISTS idx_startups_cohort_id ON startups(cohort_id);

CREATE INDEX IF NOT EXISTS idx_mentor_requests_startup_id ON mentor_requests(startup_id);
CREATE INDEX IF NOT EXISTS idx_mentor_requests_founder_id ON mentor_requests(founder_id);
CREATE INDEX IF NOT EXISTS idx_mentor_requests_mentor_id ON mentor_requests(mentor_id);

CREATE INDEX IF NOT EXISTS idx_applications_startup_id ON applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_applications_founder_id ON applications(founder_id);
CREATE INDEX IF NOT EXISTS idx_applications_incubator_id ON applications(incubator_id);
CREATE INDEX IF NOT EXISTS idx_applications_cohort_id ON applications(cohort_id);

CREATE INDEX IF NOT EXISTS idx_sessions_startup_id ON sessions(startup_id);
CREATE INDEX IF NOT EXISTS idx_sessions_founder_id ON sessions(founder_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mentor_id ON sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_incubator_id ON sessions(incubator_id);

CREATE INDEX IF NOT EXISTS idx_messages_startup_id ON messages(startup_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
