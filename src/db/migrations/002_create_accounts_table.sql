CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    type VARCHAR(20) DEFAULT 'customer',

    status VARCHAR(20) DEFAULT 'active',

    auth_method VARCHAR(20) DEFAULT 'PASSWORD',

    name VARCHAR NOT NULL,

    username VARCHAR UNIQUE NOT NULL,

    email VARCHAR UNIQUE NOT NULL,

    password_hash VARCHAR,

    avatar_url VARCHAR,

    is_vip BOOLEAN DEFAULT FALSE,

    email_verified_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    updated_at TIMESTAMPTZ DEFAULT NOW(),

    deleted_at TIMESTAMPTZ
);