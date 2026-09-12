
BEGIN;


-- ============================================================
-- 1. COUNTRIES
-- ============================================================

INSERT INTO countries (name, code, is_active)
VALUES
    ('United States', 'US', TRUE),
    ('Canada', 'CA', TRUE),
    ('United Kingdom', 'GB', TRUE)
ON CONFLICT (code) DO NOTHING;


-- ============================================================
-- 2. CITIES
-- ============================================================

INSERT INTO cities (country_id, name, is_active)
SELECT c.id, x.city_name, TRUE
FROM (
    VALUES
        ('US', 'New York'),
        ('US', 'Los Angeles'),
        ('US', 'Chicago'),
        ('CA', 'Toronto'),
        ('CA', 'Vancouver'),
        ('GB', 'London'),
        ('GB', 'Manchester')
) AS x(country_code, city_name)
JOIN countries c ON c.code = x.country_code
ON CONFLICT (country_id, name) DO NOTHING;


-- ============================================================
-- 3. ACCOUNTS
-- ============================================================
-- Password for all development accounts:
-- Password123!
--
-- pgcrypto is already enabled by your migration, so crypt()
-- can generate a valid bcrypt password hash.
--
-- Customers:
-- john@example.com
-- jane@example.com
-- mike@example.com
-- sarah@example.com
--
-- Admin:
-- admin@example.com
-- ============================================================

INSERT INTO accounts (
    type,
    status,
    channel,
    name,
    username,
    email,
    number,
    password_hash,
    is_vip,
    vip_started_at,
    vip_expired_at,
    email_verified_at,
    created_at
)
VALUES
(
    'customer',
    'active',
    'email',
    'John Carter',
    'john_carter',
    'john@example.com',
    '+12125550101',
    crypt('Password123!', gen_salt('bf', 10)),
    FALSE,
    NULL,
    NULL,
    NOW(),
    NOW() - INTERVAL '20 days'
),
(
    'customer',
    'active',
    'email',
    'Jane Smith',
    'jane_smith',
    'jane@example.com',
    '+12125550102',
    crypt('Password123!', gen_salt('bf', 10)),
    TRUE,
    NOW() - INTERVAL '20 days',
    NOW() + INTERVAL '160 days',
    NOW(),
    NOW() - INTERVAL '15 days'
),
(
    'customer',
    'active',
    'email',
    'Mike Johnson',
    'mike_johnson',
    'mike@example.com',
    '+14165550103',
    crypt('Password123!', gen_salt('bf', 10)),
    FALSE,
    NULL,
    NULL,
    NOW(),
    NOW() - INTERVAL '10 days'
),
(
    'customer',
    'active',
    'email',
    'Sarah Williams',
    'sarah_williams',
    'sarah@example.com',
    '+44205550104',
    crypt('Password123!', gen_salt('bf', 10)),
    TRUE,
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '175 days',
    NOW(),
    NOW() - INTERVAL '5 days'
),
(
    'admin',
    'active',
    'email',
    'System Administrator',
    'admin',
    'admin@example.com',
    NULL,
    crypt('Password123!', gen_salt('bf', 10)),
    FALSE,
    NULL,
    NULL,
    NOW(),
    NOW() - INTERVAL '30 days'
)
ON CONFLICT (email) DO NOTHING;


-- ============================================================
-- 4. PAYMENT METHODS
-- ============================================================
-- Your migration already creates these two methods, but
-- ON CONFLICT makes the seed safe to run again.
-- ============================================================

INSERT INTO payment_methods (name, is_online, is_active)
VALUES
    ('Cash on Delivery', FALSE, TRUE),
    ('Visa / Mastercard', TRUE, TRUE),
    ('Bank Transfer', TRUE, TRUE)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 5. PACKAGES
-- ============================================================

INSERT INTO packages (
    name,
    slug,
    description,
    price,
    img_url,
    is_vip_only,
    is_active
)
VALUES
(
    'Classic Delivery',
    'classic-delivery',
    'Standard delivery package for regular customers.',
    9.99,
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
    FALSE,
    TRUE
),
(
    'Premium Delivery',
    'premium-delivery',
    'Faster delivery with priority handling.',
    19.99,
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    FALSE,
    TRUE
),
(
    'VIP Express',
    'vip-express',
    'Exclusive express delivery package for VIP customers.',
    29.99,
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088',
    TRUE,
    TRUE
),
(
    'VIP Ultimate',
    'vip-ultimate',
    'Premium VIP delivery with maximum priority.',
    49.99,
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    TRUE,
    TRUE
)
ON CONFLICT (slug) DO NOTHING;


-- ============================================================
-- 6. BRANCHES
-- ============================================================
-- country_id and city_id are fetched dynamically.
-- ============================================================

INSERT INTO branches (
    country_id,
    city_id,
    address,
    latitude,
    longitude,
    name,
    description,
    is_active
)
SELECT
    c.id,
    ci.id,
    x.address,
    x.latitude,
    x.longitude,
    x.branch_name,
    x.description,
    TRUE
FROM (
    VALUES
    (
        'US',
        'New York',
        '350 5th Avenue, New York, NY 10118',
        40.748817::DECIMAL(9,6),
        -73.985428::DECIMAL(9,6),
        'New York Central Branch',
        'Main delivery branch serving Manhattan.'
    ),
    (
        'US',
        'Los Angeles',
        '100 S Grand Avenue, Los Angeles, CA 90012',
        34.054907::DECIMAL(9,6),
        -118.242643::DECIMAL(9,6),
        'Los Angeles Branch',
        'Main delivery branch serving Los Angeles.'
    ),
    (
        'CA',
        'Toronto',
        '100 Queen Street West, Toronto, ON M5H 2N2',
        43.653225::DECIMAL(9,6),
        -79.383186::DECIMAL(9,6),
        'Toronto Branch',
        'Main Canadian delivery branch.'
    ),
    (
        'GB',
        'London',
        '10 Downing Street, London SW1A 2AA',
        51.503399::DECIMAL(9,6),
        -0.127647::DECIMAL(9,6),
        'London Central Branch',
        'Main London delivery branch.'
    )
) AS x(
    country_code,
    city_name,
    address,
    latitude,
    longitude,
    branch_name,
    description
)
JOIN countries c
    ON c.code = x.country_code
JOIN cities ci
    ON ci.country_id = c.id
    AND ci.name = x.city_name;


-- ============================================================
-- 7. SETTINGS
-- ============================================================
-- One settings row per branch because your schema has:
-- UNIQUE(branch_id)
-- ============================================================

INSERT INTO settings (
    branch_id,
    is_open,
    closes_at,
    max_classic_orders,
    max_vip_orders,
    requested_classic_orders,
    requested_vip_orders,
    restarted_at
)
SELECT
    b.id,
    TRUE,
    NOW() + INTERVAL '10 hours',
    100,
    50,
    0,
    0,
    NOW()
FROM branches b
WHERE b.name IN (
    'New York Central Branch',
    'Los Angeles Branch',
    'Toronto Branch',
    'London Central Branch'
)
ON CONFLICT (branch_id) DO NOTHING;


-- ============================================================
-- 8. FOOTER TITLES
-- ============================================================

INSERT INTO footer_titles (key, is_active)
VALUES
    ('Company', TRUE),
    ('Support', TRUE),
    ('Legal', TRUE),
    ('Social', TRUE);


-- ============================================================
-- 9. FOOTER ITEMS
-- ============================================================

INSERT INTO footer_items (
    footer_title_id,
    name,
    reference,
    is_active
)
SELECT
    ft.id,
    x.item_name,
    x.item_reference,
    TRUE
FROM (
    VALUES
        ('Company', 'About Us', '/about'),
        ('Company', 'Our Branches', '/branches'),
        ('Company', 'Packages', '/packages'),

        ('Support', 'Contact Us', '/contact'),
        ('Support', 'FAQ', '/faq'),
        ('Support', 'Report a Problem', '/report'),

        ('Legal', 'Privacy Policy', '/privacy'),
        ('Legal', 'Terms & Conditions', '/terms'),

        ('Social', 'Facebook', 'https://facebook.com'),
        ('Social', 'Instagram', 'https://instagram.com'),
        ('Social', 'Twitter', 'https://twitter.com')
) AS x(title_key, item_name, item_reference)
JOIN footer_titles ft
    ON ft.key = x.title_key;


-- ============================================================
-- 10. ORDERS
-- ============================================================
-- IMPORTANT:
-- We fetch every foreign key instead of manually entering UUIDs.
--
-- orders requires:
--   client_id
--   payment_method_id
--   package_id
--   branch_id
--
-- Your schema also prevents more than one pending order
-- for the same client.
-- ============================================================


-- John -> delivered Classic order

INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
    reference,
    status,
    created_at,
    updated_at
)
SELECT
    a.id,
    pm.id,
    p.id,
    b.id,
    p.price,
    '250 West 34th Street, New York, NY 10001',
    a.number,
    'ORD-JOHN-001',
    'delivered',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '11 days'
FROM accounts a
JOIN payment_methods pm
    ON pm.name = 'Cash on Delivery'
JOIN packages p
    ON p.slug = 'classic-delivery'
JOIN branches b
    ON b.name = 'New York Central Branch'
WHERE a.email = 'john@example.com';


-- Jane -> paid VIP order

INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
    reference,
    status,
    created_at,
    updated_at
)
SELECT
    a.id,
    pm.id,
    p.id,
    b.id,
    p.price,
    '5th Avenue, New York, NY 10022',
    a.number,
    'ORD-JANE-001',
    'payed',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days'
FROM accounts a
JOIN payment_methods pm
    ON pm.name = 'Visa / Mastercard'
JOIN packages p
    ON p.slug = 'vip-express'
JOIN branches b
    ON b.name = 'New York Central Branch'
WHERE a.email = 'jane@example.com';


-- Mike -> canceled order

INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
    reference,
    status,
    created_at,
    updated_at
)
SELECT
    a.id,
    pm.id,
    p.id,
    b.id,
    p.price,
    '100 S Grand Avenue, Los Angeles, CA 90012',
    a.number,
    'ORD-MIKE-001',
    'canceled',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '7 days'
FROM accounts a
JOIN payment_methods pm
    ON pm.name = 'Cash on Delivery'
JOIN packages p
    ON p.slug = 'premium-delivery'
JOIN branches b
    ON b.name = 'Los Angeles Branch'
WHERE a.email = 'mike@example.com';


-- Sarah -> accepted VIP order

INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
    reference,
    status,
    created_at,
    updated_at
)
SELECT
    a.id,
    pm.id,
    p.id,
    b.id,
    p.price,
    '20 King Street, London SW1Y 6QW',
    a.number,
    'ORD-SARAH-001',
    'accepted',
    NOW() - INTERVAL '1 day',
    NOW()
FROM accounts a
JOIN payment_methods pm
    ON pm.name = 'Visa / Mastercard'
JOIN packages p
    ON p.slug = 'vip-ultimate'
JOIN branches b
    ON b.name = 'London Central Branch'
WHERE a.email = 'sarah@example.com';


-- Mike -> current pending order
-- Only one pending order is created for Mike because of:
-- one_pending_order_per_client

INSERT INTO orders (
    client_id,
    payment_method_id,
    package_id,
    branch_id,
    price,
    delivery_location,
    contact,
    reference,
    status
)
SELECT
    a.id,
    pm.id,
    p.id,
    b.id,
    p.price,
    '500 North Michigan Avenue, Chicago, IL 60611',
    a.number,
    'ORD-MIKE-002',
    'pending'
FROM accounts a
JOIN payment_methods pm
    ON pm.name = 'Cash on Delivery'
JOIN packages p
    ON p.slug = 'classic-delivery'
JOIN branches b
    ON b.name = 'New York Central Branch'
WHERE a.email = 'mike@example.com';


-- ============================================================
-- 11. ORDER PAYMENTS
-- ============================================================
-- Only create payment records for orders where payment
-- actually makes sense.
--
-- For the Stripe payment, provider_intent_id is fake but
-- realistic enough for development/testing.
-- ============================================================

INSERT INTO order_payments (
    order_id,
    payment_method_id,
    provider,
    provider_intent_id,
    transaction_reference,
    status,
    amount,
    metadata,
    paid_at
)
SELECT
    o.id,
    pm.id,
    'stripe',
    'pi_dev_jane_001',
    'TXN-JANE-001',
    'success',
    o.price,
    '{"environment":"development","seed":true}'::jsonb,
    NOW() - INTERVAL '2 days'
FROM orders o
JOIN accounts a
    ON a.id = o.client_id
JOIN payment_methods pm
    ON pm.name = 'Visa / Mastercard'
WHERE a.email = 'jane@example.com'
  AND o.reference = 'ORD-JANE-001';


-- ============================================================
-- 12. REVIEWS
-- ============================================================

INSERT INTO reviews (
    account_id,
    rating,
    comment,
    is_approved,
    created_at
)
SELECT
    a.id,
    x.rating,
    x.comment,
    TRUE,
    NOW() - x.age
FROM (
    VALUES
        (
            'john@example.com',
            5,
            'Excellent service. The delivery was fast and everything arrived exactly as expected.',
            INTERVAL '10 days'
        ),
        (
            'jane@example.com',
            5,
            'The VIP service was fantastic. Very quick delivery and great communication.',
            INTERVAL '6 days'
        ),
        (
            'mike@example.com',
            4,
            'Good service overall. The package arrived safely and the ordering process was easy.',
            INTERVAL '4 days'
        ),
        (
            'sarah@example.com',
            5,
            'Very professional service and a smooth delivery experience.',
            INTERVAL '2 days'
        )
) AS x(email, rating, comment, age)
JOIN accounts a
    ON a.email = x.email;


-- ============================================================
-- 13. REPORTS
-- ============================================================

INSERT INTO reports (
    account_id,
    report,
    created_at
)
SELECT
    a.id,
    x.report,
    NOW() - x.age
FROM (
    VALUES
        (
            'john@example.com',
            'The delivery tracking page took a few seconds to update after the package was delivered.',
            INTERVAL '9 days'
        ),
        (
            'mike@example.com',
            'The package selection screen could explain the differences between Classic and Premium more clearly.',
            INTERVAL '3 days'
        )
) AS x(email, report, age)
JOIN accounts a
    ON a.email = x.email;


-- ============================================================
-- 14. OPTIONAL OTP FOR DEVELOPMENT
-- ============================================================
-- OTP = 123456
--
-- Useful if you want to test OTP-related queries manually.
-- The hash is generated using the same bcrypt mechanism as
-- the application.
-- ============================================================

INSERT INTO otps (
    account_id,
    channel,
    otp_hash,
    used,
    expires_at
)
SELECT
    a.id,
    'email',
    crypt('123456', gen_salt('bf', 10)),
    FALSE,
    NOW() + INTERVAL '10 minutes'
FROM accounts a
WHERE a.email = 'john@example.com';


COMMIT;
