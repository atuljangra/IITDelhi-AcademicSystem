var connectionString = process.env.DATABASE_URL || 'postgres://postgres:niks@localhost:5432/acad';

module.exports = connectionString;
