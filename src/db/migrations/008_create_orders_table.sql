CREATE TYPE order_status AS ENUM (
    'pending',
    'accepted',
    'payed',
    'delivered',
    'canceled'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL
        REFERENCES accounts(id),

    payment_method_id UUID NOT NULL
        REFERENCES payment_methods(id),

    package_id UUID NOT NULL
        REFERENCES packages(id),

    branch_id UUID NOT NULL
        REFERENCES branches(id),

    price DECIMAL(10,2) NOT NULL,

    delivery_location VARCHAR NOT NULL,

    contact VARCHAR,

    reference VARCHAR,

    status order_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_branch_id ON orders(branch_id);

CREATE UNIQUE INDEX one_pending_order_per_client
ON orders(client_id)
WHERE status = 'pending';