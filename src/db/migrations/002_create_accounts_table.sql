CREATE TYPE account_type AS ENUM ('customer', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'blocked', 'deleted', 'restricted');
CREATE TYPE account_channel AS ENUM ('email', 'phone');

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type account_type NOT NULL DEFAULT 'customer',

    status account_status NOT NULL DEFAULT 'active',

    channel account_channel NOT NULL DEFAULT 'email',

    name VARCHAR NOT NULL,

    username VARCHAR UNIQUE NOT NULL,

    email VARCHAR UNIQUE,

    number VARCHAR UNIQUE,

    avatar_url VARCHAR,

    password_hash VARCHAR NOT NULL,

    is_vip BOOLEAN NOT NULL DEFAULT FALSE,

    vip_started_at TIMESTAMPTZ,

    vip_expired_at TIMESTAMPTZ,

    email_verified_at TIMESTAMPTZ,

    phone_verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ,

    CONSTRAINT accounts_contact_required CHECK (email IS NOT NULL OR number IS NOT NULL)
);

CREATE INDEX idx_accounts_status ON accounts(status);