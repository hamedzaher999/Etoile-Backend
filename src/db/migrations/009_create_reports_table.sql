CREATE TABLE reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
    report TEXT NOT NULL,                                   
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

