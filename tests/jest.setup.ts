// tests/jest.setup.ts

// Set test-specific environment variables
process.env.JWT_SECRET = process.env.JWT_SECRET || "testsecret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Optional but nice to have
process.env.NODE_ENV = 'test';
