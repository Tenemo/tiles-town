process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '4200';
process.env.DATABASE_URL =
    process.env.DATABASE_URL ||
    'postgres://postgres:postgres@127.0.0.1:5434/tiles-town';
process.env.DATABASE_SSL = process.env.DATABASE_SSL || 'false';
process.env.CORS_ALLOWED_ORIGINS =
    process.env.CORS_ALLOWED_ORIGINS ||
    'http://127.0.0.1:3200,http://localhost:3200';
