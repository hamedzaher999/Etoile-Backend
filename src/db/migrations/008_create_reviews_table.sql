CREATE TABLE reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
    comment TEXT NOT NULL,                                   
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX review_date ON reviews(created_at DESC) 
WHERE deleted_at IS NULL AND is_approved = true;

INSERT INTO reviews (account_id, rating, comment, is_approved) VALUES
((SELECT id FROM accounts LIMIT 1), 5, 'The dark chocolate truffles are absolutely out of this world. Will definitely be ordering again!', true),
((SELECT id FROM accounts LIMIT 1), 5, 'Best artisan chocolate in town. The sea salt caramel bars are a perfect balance of sweet and salty.', true),
((SELECT id FROM accounts LIMIT 1), 4, 'Incredible selection of milk chocolates, though the shipping took a day longer than expected.', true),
((SELECT id FROM accounts LIMIT 1), 5, 'Beautiful packaging! Bought a gift box for my mother and she was absolutely thrilled with the variety.', true),
((SELECT id FROM accounts LIMIT 1), 2, 'The white chocolate raspberry bars were way too sweet for my taste. Tasted mostly like sugar.', true),
((SELECT id FROM accounts LIMIT 1), 5, 'The hazelnut praline melted in my mouth. Pure perfection. Worth every single penny.', true),
((SELECT id FROM accounts LIMIT 1), 3, 'The chocolate itself is amazing, but three of the pieces in my box arrived slightly melted.', true),
((SELECT id FROM accounts LIMIT 1), 5, 'I love that they have high-quality vegan and dairy-free options that actually taste rich and creamy!', true),
((SELECT id FROM accounts LIMIT 1), 4, 'Excellent 85% dark chocolate. Deep, complex flavor notes. A bit pricey but the quality is undeniable.', true),
((SELECT id FROM accounts LIMIT 1), 5, 'Hands down the best chocolate-covered strawberries I have ever had. Fresh and thick premium chocolate.', true),
((SELECT id FROM accounts LIMIT 1), 1, 'Extremely disappointed. My order arrived completely melted into one big brown blob. Unacceptable.', false),
((SELECT id FROM accounts LIMIT 1), 5, 'Customer service is fantastic! They replaced a damaged box immediately with no extra charge. 10/10.', true),
((SELECT id FROM accounts LIMIT 1), 4, 'Very unique flavor combinations. The chili-infused dark chocolate has a wonderful, subtle kick to it.', true),
((SELECT id FROM accounts LIMIT 1), 2, 'The chocolate bonbons look stunning, but the fillings lacked flavor. Mostly just tasted like plain syrup.', true),
((SELECT id FROM accounts LIMIT 1), 5, 'A chocolate lover''s paradise. The single-origin Madagascar bar is complex, fruity, and brilliant.', true);