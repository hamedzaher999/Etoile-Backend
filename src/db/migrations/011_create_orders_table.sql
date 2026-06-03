CREATE TYPE order_status AS ENUM (
    'pending',
    'accepted',
    'preparing',
    'shipping',
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

    country_id UUID NOT NULL
        REFERENCES countries(id),

    city_id UUID NOT NULL
        REFERENCES cities(id),

    price NUMERIC(10,2) NOT NULL,

    delivery_location TEXT NOT NULL,

    receiver_phone VARCHAR(30),
    
    receiver_name VARCHAR(150),

    reference VARCHAR(100) UNIQUE NOT NULL,

    status order_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX idx_orders_client_id
ON orders(client_id) 

CREATE UNIQUE INDEX one_pending_order_per_user
ON orders(client_id)
WHERE status = 'pending';