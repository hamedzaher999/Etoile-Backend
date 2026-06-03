CREATE TABLE refresh_tokens (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL
    REFERENCES accounts(id)
    ON DELETE CASCADE,

    replaced_by_token_id UUID
    REFERENCES refresh_tokens(id),

    token_hash VARCHAR UNIQUE NOT NULL,

    is_revoked BOOLEAN DEFAULT FALSE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    last_used_at TIMESTAMPTZ DEFAULT NOW(),

    ip_address VARCHAR,

    device_name VARCHAR,

    user_agent TEXT

);

CREATE INDEX idx_refresh_tokens_account_id
ON refresh_tokens(account_id);

CREATE INDEX idx_refresh_tokens_lookup
ON refresh_tokens(token_hash, is_revoked, expires_at)

   
CREATE INDEX idx_refresh_tokens_cleanup
ON refresh_tokens(expires_at, is_revoked, created_at)