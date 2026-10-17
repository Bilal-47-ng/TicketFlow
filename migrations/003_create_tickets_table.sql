
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
        CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),

    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
        CHECK(status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),

    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
)