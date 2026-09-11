CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

    is_open BOOLEAN NOT NULL DEFAULT TRUE,

    closes_at TIMESTAMPTZ,

    max_classic_orders INT NOT NULL DEFAULT 0,

    max_vip_orders INT NOT NULL DEFAULT 0,

    requested_classic_orders INT NOT NULL DEFAULT 0,

    requested_vip_orders INT NOT NULL DEFAULT 0,

    restarted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX one_setting_per_branch ON settings(branch_id);