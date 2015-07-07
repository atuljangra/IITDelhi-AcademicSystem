var connectionString = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/acad';

module.exports = connectionString;
