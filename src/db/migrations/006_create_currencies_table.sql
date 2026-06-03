CREATE Table currencies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    currency VARCHAR UNIQUE NOT NULL,
    currency_code VARCHAR NOT NULL,
    currency_symbol VARCHAR NOT NULL ,
    is_active BOOLEAN NOT NULL DEFAULT true, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
)

CREATE INDEX idx_currencies_active ON currencies(currency_code) 
WHERE is_active = TRUE AND deleted_at IS NULL
