CREATE TYPE otp_channel AS ENUM ('email', 'phone');

CREATE TABLE otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    channel otp_channel NOT NULL DEFAULT 'email',

    otp_hash VARCHAR NOT NULL,

    used BOOLEAN NOT NULL DEFAULT FALSE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otps_account_id ON otps(account_id);