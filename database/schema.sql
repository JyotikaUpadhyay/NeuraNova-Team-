-- =======================================================================
-- NEURANOVA ENERGY RESILIENCE PLATFORM - DATABASE SCHEMA
-- PostgreSQL 15+ with TimescaleDB Extension
-- =======================================================================

-- Enable UUID and Timescale extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE; -- Uncomment if TimescaleDB extension is active

-- 1. SCENARIOS TABLE
CREATE TABLE IF NOT EXISTS scenarios (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    region VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    disrupted_chokepoints TEXT[],
    disrupted_refineries TEXT[],
    estimated_bpd_deficit BIGINT NOT NULL DEFAULT 0,
    projected_duration_days INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AGENT RUNS & EXECUTION AUDIT LOGS
CREATE TABLE IF NOT EXISTS agent_runs (
    id VARCHAR(64) PRIMARY KEY,
    scenario_id VARCHAR(64) REFERENCES scenarios(id) ON DELETE CASCADE,
    agent_type VARCHAR(64) NOT NULL,
    agent_name VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL,
    confidence_score INT NOT NULL DEFAULT 90,
    output_payload JSONB NOT NULL,
    execution_duration_ms INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_scenario ON agent_runs(scenario_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_type ON agent_runs(agent_type);

-- 3. MARITIME CHOKEPOINTS TELEMETRY
CREATE TABLE IF NOT EXISTS chokepoints (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    daily_flow_mbpd DECIMAL(6, 2) NOT NULL,
    global_share_pct DECIMAL(5, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    transit_flow_drop_pct DECIMAL(5, 2) DEFAULT 0,
    risk_score INT NOT NULL DEFAULT 20,
    incident_summary TEXT,
    alternate_route TEXT,
    extra_transit_days INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMMODITY PRICE METRICS (Time-Series)
CREATE TABLE IF NOT EXISTS price_metrics (
    time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    benchmark VARCHAR(32) NOT NULL,
    price_usd DECIMAL(8, 2) NOT NULL,
    projected_peak_usd DECIMAL(8, 2),
    pct_change DECIMAL(6, 2),
    scenario_id VARCHAR(64) REFERENCES scenarios(id) ON DELETE SET NULL
);

-- If TimescaleDB is loaded:
-- SELECT create_hypertable('price_metrics', 'time', if_not_exists => TRUE);
CREATE INDEX IF NOT EXISTS idx_price_metrics_time ON price_metrics(time DESC);
CREATE INDEX IF NOT EXISTS idx_price_metrics_benchmark ON price_metrics(benchmark);

-- 5. STRATEGIC PETROLEUM RESERVE (SPR) CAVERNS
CREATE TABLE IF NOT EXISTS spr_inventories (
    id VARCHAR(64) PRIMARY KEY,
    cavern_name VARCHAR(128) NOT NULL,
    location_state VARCHAR(64) NOT NULL,
    current_stock_mbbl DECIMAL(8, 2) NOT NULL,
    max_capacity_mbbl DECIMAL(8, 2) NOT NULL,
    max_drawdown_rate_mbpd DECIMAL(5, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'OPERATIONAL',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ALTERNATIVE SUPPLIERS
CREATE TABLE IF NOT EXISTS alternative_suppliers (
    id VARCHAR(64) PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    origin_country VARCHAR(128) NOT NULL,
    origin_port VARCHAR(128) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    crude_grade VARCHAR(128) NOT NULL,
    available_capacity_bpd BIGINT NOT NULL,
    lead_time_days INT NOT NULL,
    freight_delta_usd DECIMAL(6, 2) NOT NULL,
    total_landed_cost_usd DECIMAL(6, 2) NOT NULL,
    feasibility_score INT NOT NULL,
    contract_flexibility VARCHAR(32) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHAT MESSAGES & COPILOT CONVERSATIONS
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    role VARCHAR(32) NOT NULL,
    content TEXT NOT NULL,
    thought_process JSONB,
    tool_calls JSONB,
    suggested_actions JSONB,
    active_scenario_context VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEED DATA
INSERT INTO chokepoints (id, name, latitude, longitude, daily_flow_mbpd, global_share_pct, status, risk_score, incident_summary, alternate_route, extra_transit_days)
VALUES 
('hormuz', 'Strait of Hormuz', 26.5667, 56.2500, 21.0, 21.0, 'OPEN', 24, 'Normal maritime operations.', 'East-West Petroline Bypass', 0),
('babelmandeb', 'Bab el-Mandeb (Red Sea)', 12.5833, 43.3333, 8.8, 8.8, 'RESTRICTED', 78, 'Active anti-ship drone alerts.', 'Cape of Good Hope Route', 14),
('suez', 'Suez Canal', 30.5852, 32.2654, 5.5, 5.5, 'RESTRICTED', 65, 'Flow constrained by Red Sea corridor.', 'Cape of Good Hope Route', 12),
('malacca', 'Strait of Malacca', 4.2105, 100.9925, 16.0, 16.0, 'OPEN', 18, 'Normal high-density shipping operations.', 'Lombok Strait', 3),
('bosporus', 'Turkish Straits (Bosporus)', 41.1172, 29.0734, 3.2, 3.2, 'OPEN', 42, 'War-risk insurance active.', 'BTC Pipeline', 4),
('panama', 'Panama Canal', 9.1012, -79.6955, 1.2, 1.2, 'CONGESTED', 52, 'Reservoir drought restrictions.', 'Cape Horn', 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO spr_inventories (id, cavern_name, location_state, current_stock_mbbl, max_capacity_mbbl, max_drawdown_rate_mbpd)
VALUES
('bryan_mound', 'Bryan Mound Salt Dome', 'Texas', 135.0, 247.0, 1.5),
('big_hill', 'Big Hill Salt Dome', 'Texas', 95.0, 170.0, 1.1),
('west_hackberry', 'West Hackberry Salt Dome', 'Louisiana', 105.0, 220.0, 1.3),
('bayou_choctaw', 'Bayou Choctaw Caverns', 'Louisiana', 40.0, 76.0, 0.5)
ON CONFLICT (id) DO NOTHING;
