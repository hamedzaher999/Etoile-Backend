CREATE TABLE order_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    payment_method_id UUID NOT NULL
        REFERENCES payment_methods(id),

    provider VARCHAR NOT NULL DEFAULT 'stripe',

    provider_intent_id VARCHAR UNIQUE,

    transaction_reference VARCHAR,

    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'success', 'failed')),

    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),

    metadata JSONB,

    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_payments_order_id ON order_payments(order_id);
CREATE INDEX idx_order_payments_status ON order_payments(status);
CREATE INDEX idx_order_payments_intent ON order_payments(provider_intent_id);