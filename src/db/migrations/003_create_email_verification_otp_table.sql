CREATE TABLE email_verification_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    otp_hash VARCHAR NOT NULL,

    used BOOLEAN DEFAULT FALSE,

    expires_at TIMESTAMPTZ NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_verification_otps_account_id
ON email_verification_otps(account_id);