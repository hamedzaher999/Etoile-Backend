CREATE TABLE footer_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE footer_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    footer_title_id UUID NOT NULL REFERENCES footer_titles(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    reference VARCHAR NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_footer_items_title_id ON footer_items(footer_title_id);