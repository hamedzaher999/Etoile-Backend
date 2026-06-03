CREATE Table packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(150) NOT NULL,

    description TEXT,
    
    price DECIMAL(10,2) NOT NULL,
    
    img_url TEXT,

    is_Vip_only BOOLEAN NOT NULL DEFAULT FALSE,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    deleted_at TIMESTAMPTZ
)