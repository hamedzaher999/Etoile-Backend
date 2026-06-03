CREATE Table countries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    code VARCHAR UNIQUE not NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ null
);

CREATE Table cities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id uuid REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR  NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ null,
    CONSTRAINT unique_city_per_country UNIQUE (country_id ,name)
);



CREATE INDEX idx_active on countries(is_active)

CREATE INDEX idx_countries_active on cities(country_id, is_active)