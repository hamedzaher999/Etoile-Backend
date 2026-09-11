CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    country_id UUID NOT NULL REFERENCES countries(id),

    city_id UUID NOT NULL REFERENCES cities(id),

    address TEXT NOT NULL,

    latitude DECIMAL(9,6),

    longitude DECIMAL(9,6),

    name VARCHAR NOT NULL,

    description VARCHAR,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_branches_city_id ON branches(city_id);
CREATE INDEX idx_branches_active ON branches(is_active);