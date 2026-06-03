
CREATE TABLE order_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    order_id UUID NOT NULL
        REFERENCES orders(id)
        ON DELETE CASCADE,

    payment_method_id UUID NOT NULL
        REFERENCES payment_methods(id),

    transaction_reference VARCHAR(150) UNIQUE,

    status VARCHAR(30) NOT NULL
    CHECK (
        status IN (
            'pending',
            'success',
            'failed',
            'refunded',
            'partially_refunded'
        )
    ),

    amount NUMERIC(10,2) NOT NULL
        CHECK (amount >= 0),

    metadata JSONB,

    paid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_payments_order_id
ON order_payments(order_id);

CREATE INDEX idx_order_payments_status
ON order_payments(status);
